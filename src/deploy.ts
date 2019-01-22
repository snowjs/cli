import * as parser from 'docker-file-parser';
import * as path from 'path';
import { logError, readFile, run } from './utils';

interface INowJSON {
  name?: string;
  files?: string[];
  alias?: string[];
}

interface IDeployment {
  metadata: {
    generation: number;
  };
  spec: {
    template: {
      spec: {
        containers: [{
          image: string;
        }];
      };
    };
  };
}

function verifyNowJSON({alias, name}: INowJSON): Promise<void> {
  if (!name) {
    const msg = 'Specify a "name" (string) property in now.json';
    logError(msg);
    return Promise.reject();
  }

  if (!alias) {
    const msg = 'Specify an "alias" (string[]) property in now.json';
    logError(msg);
    return Promise.reject();
  }

  return Promise.resolve();
}

function getDockerfilePort(commands: parser.CommandEntry[]): Promise<string> {
  let dockerFilePort: string | undefined;
  commands.forEach(({args, name}) => {
    if (name !== 'EXPOSE') {
      return;
    }
    console.log('args is', args);
    if (typeof args === 'string') {
      const port = args.match(/\d/g);
      if (port) {
        dockerFilePort = port.join('');
      }
    } else if (Array.isArray(args)) {
      const argsAsString = args.join(' ');
      const port = argsAsString.match(/\d/g);
      if (port) {
        dockerFilePort = port.join('');
      }
    }
  });

  if (!dockerFilePort) {
    return Promise.reject();
  }

  return Promise.resolve(dockerFilePort);
}

export default async () => {
  // Verify we have a Dockerfile
  let dockerFile: parser.CommandEntry[];
  const dockerFilePath = path.resolve(process.cwd(), 'Dockerfile');
  try {
    const content = await readFile(dockerFilePath);
    dockerFile = parser.parse(content.toString());
  } catch (error) {
    const msg = `Error finding Dockerfile.\n${error.message}`;
    logError(msg);
    return;
  }

  // Verify we have a well-formatted now.json file
  const nowFilePath = path.resolve(process.cwd(), 'now.json');
  let nowConfig;
  try {
    const nowFile = await readFile(nowFilePath);
    nowConfig = JSON.parse(nowFile.toString());
  } catch (error) {
    const msg = `Error reading now.json.\n${error.message}`;
    logError(msg);
    return;
  }
  verifyNowJSON(nowConfig);
  const {name, files} = nowConfig;

  // Get revision number.
  let deployment: IDeployment | undefined;
  let revision: number;
  try {
    // See if we have a deployment.
    const {stdout: deploymentStr} = await run(`kubectl get deployments/${name} -o json`);
    // Deployment exists. Update it.
    deployment = JSON.parse(deploymentStr);
    const {metadata: {generation}} = JSON.parse(deploymentStr);
    revision = generation + 1;
  } catch (e) {
    // No deployment exists.
    revision = 1;
  }

  // Create a volume for persisting the build context
  const pvcName = `${name}-buildctx`;
  await run(`
  cat <<EOF | kubectl create -f -
    {
      "kind": "PersistentVolumeClaim",
      "apiVersion": "v1",
      "metadata": {
        "name": "${pvcName}"
      },
      "spec": {
        "accessModes": [
          "ReadWriteOnce"
        ],
        "volumeMode": "Filesystem",
        "resources": {
          "requests": {
            "storage": "1Gi"
          }
        }
      }
    }
  \nEOF`);

  // Create a pod for uploading the build context
  const uploadPodPrefix = `${name}-bctx`;
  const podName = `${uploadPodPrefix}-pod`;
  const contName = `${uploadPodPrefix}-cont`;
  await run(`
  cat <<EOF | kubectl create -f -
    {
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "${podName}"
      },
      "spec": {
        "volumes": [
          {
            "name": "storage",
            "persistentVolumeClaim": {
              "claimName": "${pvcName}"
            }
          }
        ],
        "containers": [
          {
            "name": "${contName}",
            "image": "alpine",
            "args": [
              "sh",
              "-c",
              "while true; do sleep 1; if [ -f /tmp/complete ]; then break; fi done"
            ],
            "volumeMounts": [
              {
                "mountPath": "/kaniko/build-context",
                "name": "storage"
              }
            ]
          }
        ]
      }
    }
  \nEOF`);

  // Create build context tarball.
  await run(`tar cvfz buildcontext.tar.gz Dockerfile ${files.join(' ')}`);

  // Wait for pod to be ready.
  await run(`kubectl wait pods/${podName} --timeout=60s --for condition=Ready`);

  // Copy build context to container
  await run(`kubectl cp -c ${contName} buildcontext.tar.gz ${podName}:/tmp/buildcontext.tar.gz`);

  // Untar the build context
  await run(`kubectl exec ${podName} -c ${contName} -- tar -zxf /tmp/buildcontext.tar.gz -C /kaniko/build-context`);

  // Mark the upload process as complete
  await run(`kubectl exec ${podName} -c ${contName} -- touch /tmp/complete`);

  // Delete the pod so we can attach the PVC to a new pod
  await run(`kubectl delete pod/${podName}`);

  // Get Docker Registry IP Address
  const {stdout: dockerIP} = await run('kubectl get service/docker-registry -o jsonpath={.spec.clusterIP}');

  // Create an image and push it to the registry.
  const kanikoJobName = `${podName}-kaniko`;
  const imageName = `${dockerIP}:5000/${name}:${revision}`;
  await run(`
  cat <<EOF | kubectl create -f -
    {
      "apiVersion": "batch/v1",
      "kind": "Job",
      "metadata": {
        "name": "${kanikoJobName}"
      },
      "spec": {
        "template": {
          "spec": {
            "restartPolicy": "Never",
            "volumes": [
              {
                "name": "docker-config",
                "secret": {
                  "secretName": "regcred",
                  "items": [
                    {
                      "key": ".dockerconfigjson",
                      "path": "config.json"
                    }
                  ]
                }
              },
              {
                "name": "storage",
                "persistentVolumeClaim": {
                  "claimName": "${pvcName}"
                }
              }
            ],
            "containers": [
              {
                "name": "kaniko",
                "image": "gcr.io/kaniko-project/executor:latest",
                "args": [
                  "--context=dir:///kaniko/build-context",
                  "--destination=${imageName}",
                  "--insecure"
                ],
                "volumeMounts": [
                  {
                    "name": "storage",
                    "mountPath": "/kaniko/build-context"
                  },
                  {
                    "name": "docker-config",
                    "mountPath": "/kaniko/.docker"
                  }
                ]
              }
            ]
          }
        }
      }
    }
  \nEOF`);

  // Wait for Kaniko to complete / push to Docker registry.
  await run(`kubectl wait jobs/${kanikoJobName} --timeout=120s --for=condition=complete`);

  // Cleanup
  // Delete kaniko pod and PVC.
  await run(`kubectl delete jobs/${kanikoJobName}`);
  await run(`kubectl delete pvc/${pvcName}`);

  // Create or update the deployment API object.
  // Inspect dockerfile to find port.
  let dockerFilePort : string;
  try {
    dockerFilePort = await getDockerfilePort(dockerFile);
  } catch (e) {
    logError('Could not find port in Dockerfile. Did you define an EXPOSE command?');
    return;
  }

  if (!deployment) {
    // No deployment exists. Create one.
    await run(`
    cat <<EOF | kubectl create -f -
      {
        "apiVersion": "extensions/v1beta1",
        "kind": "Deployment",
        "metadata": {
          "name": "${name}"
        },
        "spec": {
          "template": {
            "metadata": {
              "labels": {
                "app": "${name}"
              }
            },
            "spec": {
              "containers": [
                {
                  "name": "${name}",
                  "image": "${imageName}",
                  "ports": [
                    {
                      "name": "app-port",
                      "containerPort": ${dockerFilePort}
                    }
                  ]
                }
              ],
              "imagePullSecrets": [
                {
                  "name": "regcred"
                }
              ]
            }
          }
        }
      }
    \nEOF`);
  } else {
    // Deployment exists. Patch it.
    const {spec: deploymentSpec} = deployment;
    deploymentSpec.template.spec.containers[0].image = imageName;
    const deploymentPatchString = JSON.stringify({spec: deploymentSpec});
    await run(`kubectl patch deployment/${name} --patch '${deploymentPatchString}'`);
  }

  // See if service object exists.
  try {
    await run(`kubectl get services/${name} -o json`);
    // Service object exists-- it does not need to be patched. Continue.
  } catch (e) {
    // No service object exists. Create one.
    await run(`
    cat <<EOF | kubectl create -f -
      {
        "apiVersion": "v1",
        "kind": "Service",
        "metadata": {
          "name": "${name}",
          "labels": {
            "app": "${name}"
          }
        },
        "spec": {
          "type": "NodePort",
          "selector": {
            "app": "${name}"
          },
          "ports": [
            {
              "port": 8080,
              "targetPort": "app-port"
            }
          ]
        }
      }
    \nEOF`);
  }
};
