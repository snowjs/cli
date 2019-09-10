import * as path from 'path';
import cloudProviders from './providers';
import { askForInput, confirm, logError, logInfo, pickOne, run } from './utils';

interface IOptions {
  'skip-provision'?: boolean;
}

export default async (opts: IOptions) => {
  const question = 'Which cloud provider are you hosting with';
  const provider = await pickOne(question, cloudProviders);

  if (!opts['skip-provision']) {
    switch (provider) {
      case 'minikube': {
        logInfo('Note: Minikube is for development purposes only.');

        // Start minikube if it isn't running
        try {
          await run('minikube status');
        } catch (error) {
          logInfo('Starting Minikube. This may take a minute.');
          await run('minikube start');
        }

        await run('minikube addons enable ingress');
        await run('helm init --wait');

        const { stdout: minikubeIP } = await run('minikube ip');

        // Install traefik
        await run(`
          helm install stable/traefik \
          --name traefik \
          --namespace kube-system \
          --set serviceType=NodePort \
          --set dashboard.enabled=true \
          --set dashboard.domain=traefik-ui.minikube
        `);
        const traefikHost = `${minikubeIP} traefik-ui.minikube`;
        logInfo(
          `Add "${traefikHost}" to your hosts file to access traefik's dashboard.`
        );

        // Install docker registry
        await run('helm install stable/docker-registry');

        if (await confirm('Install an example app on Minikube')) {
          const deployFile = path.resolve(
            __dirname,
            '../config/deployment-minikube.yaml'
          );
          await run(`kubectl apply -f ${deployFile}`);
          const whoAmIHost = `${minikubeIP} whoami.minikube`;
          logInfo(
            `Add "${whoAmIHost}" to your hosts file to access example app.`
          );
        }

        const completeMsg =
          'Creation complete. It may take a few minutes for services to become available.';
        logInfo(completeMsg);
        break;
      }
      case 'gcp': {
        // Check if we need to authenticate.
        try {
          const { stdout } = await run('gcloud auth list');
          const isAuthenticated = stdout.indexOf('*') > -1;
          if (!isAuthenticated) {
            await run('gcloud auth login');
          }
        } catch (error) {
          await run('gcloud auth login');
        }

        const { stdout: projectId } = await run(
          'gcloud config get-value project'
        );
        await run('gcloud services enable container.googleapis.com');

        // Check if we have an existing cluster
        let clusterExists = false;
        const { stdout: clusterData } = await run(
          'gcloud container clusters list'
        );
        if (clusterData.indexOf('snow-cluster') > -1) {
          clusterExists = true;
        }

        const createClusterCmd = `
          gcloud beta container \
            clusters create "snow-cluster" \
            --zone "us-west1-b" \
            --no-enable-basic-auth \
            --cluster-version "1.10.9-gke.5" \
            --image-type "COS" \
            --machine-type "f1-micro" \
            --disk-type "pd-standard" \
            --disk-size "10" \
            --default-max-pods-per-node "110" \
            --num-nodes "3" \
            --enable-cloud-logging \
            --enable-cloud-monitoring \
            --enable-ip-alias \
            --network "projects/${projectId}/global/networks/default" \
            --subnetwork "projects/${projectId}/regions/us-west1/subnetworks/default" \
            --default-max-pods-per-node "110" \
            --addons HorizontalPodAutoscaling,HttpLoadBalancing \
            --enable-autoupgrade \
            --enable-autorepair \
            --scopes "https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/trace.append" \
        `;

        if (!clusterExists) {
          await run(createClusterCmd);
        }
        break;
      }
      case 'digitalocean': {
        // Authenticate.
        logInfo('Obtain a Digital Ocean access token here: https://cloud.digitalocean.com/account/api/tokens');
        const token = await askForInput(
          'Enter your digital ocean access token'
        );
        await run(`doctl auth init -t ${token}`);

        // Check if we have an existing cluster.
        let clusterExists = true;
        try {
          await run('doctl k8s cluster get snow-cluster', {silent: true});
        } catch (e) {
          clusterExists = false;
        }

        const region = 'nyc1';
        const name = 'snow-cluster';

        if (!clusterExists) {
          // Create the cluster.
          logInfo('Creating cluster. This will take a few minutes...');
          await run(`
            doctl k8s clusters create ${name} \
              --region ${region} \
              --version 1.13.1-do.2 \
              --node-pool "name=node-pool-0;size=s-1vcpu-2gb;count=2" \
              --wait
          `);
        } else {
          logInfo('Cluster exists.');
        }

        await run(`kubectl config use-context do-${region}-${name}`);

        break;
      }
      case 'azure': {
        const resourceGroup = 'snow';
        const clusterName = 'snow-cluster';
        // Create the resource group.
        await run(`
          az group create
            -n ${resourceGroup} \
            -l westus \
        `);

        // Create the cluster.
        await run(`
          az aks create \
            -n ${clusterName} \
            -g ${resourceGroup} \
            --no-ssh-key \
            -k 1.14.5 \
            --node-count 2
        `);

        // Get credentials.
        await run(`
          az aks get-credentials \
            -g ${resourceGroup} \
            -n ${clusterName}
        `);
        break;
      }
      default: {
        logError('No valid cloud provider selected.');
      }
    }
  }

  /*
   * Authentication complete
   * Cluster exists
   * kubeconfig has properly configured auth credentials
   * Now the fun part: time to set up Kubernetes!
   */

  /*
   * Install helm with TLS.
   * https://medium.com/google-cloud/install-secure-helm-in-gke-254d520061f7
   */
  await run('helm init --client-only');

  const BYTES = 2048;

  // Create Certificate Authority
  await run(`openssl genrsa -out $(helm home)/ca.key.pem ${BYTES}`);
  const config = `
    [req]\\n
    req_extensions=v3_ca\\n
    distinguished_name=req_distinguished_name\\n
    [req_distinguished_name]\\n
    [ v3_ca ]\\n
    basicConstraints=critical,CA:TRUE\\n
    subjectKeyIdentifier=hash\\n
    authorityKeyIdentifier=keyid:always,issuer:always`;
  await run(
    `
    openssl req \\
      -config <(printf '${config}') \\
      -key $(helm home)/ca.key.pem \\
      -new \\
      -x509 \\
      -days 7300 \\
      -sha256 \\
      -out $(helm home)/ca.cert.pem \\
      -extensions v3_ca \\
      -subj "/C=US"`,
    { shell: '/bin/bash' }
  );

  // Create credentials for tiller (server)
  await run(`openssl genrsa -out $(helm home)/tiller.key.pem ${BYTES}`);
  await run(
    `
    openssl req \
      -new \
      -sha256 \
      -key $(helm home)/tiller.key.pem \
      -out $(helm home)/tiller.csr.pem \
      -subj "/C=US/O=Snow/CN=tiller-server"`,
    { shell: '/bin/bash' }
  );
  const tillerConfig = `
    [SAN]\\n
    subjectAltName=IP:127.0.0.1`;
  await run(
    `
    openssl x509 -req -days 365 \
      -CA $(helm home)/ca.cert.pem \
      -CAkey $(helm home)/ca.key.pem \
      -CAcreateserial \
      -in $(helm home)/tiller.csr.pem \
      -out $(helm home)/tiller.cert.pem \
      -extfile <(printf '${tillerConfig}') \
      -extensions SAN`,
    { shell: '/bin/bash' }
  );

  // Create credentials for helm (client)
  await run(`openssl genrsa -out $(helm home)/helm.key.pem ${BYTES}`);
  await run(`
    openssl req -new -sha256 \
      -key $(helm home)/helm.key.pem \
      -out $(helm home)/helm.csr.pem \
      -subj "/C=US"
  `);
  await run(`
    openssl x509 -req -days 365 \
      -CA $(helm home)/ca.cert.pem \
      -CAkey $(helm home)/ca.key.pem \
      -CAcreateserial \
      -in $(helm home)/helm.csr.pem \
      -out $(helm home)/helm.cert.pem
  `);

  // Create service account and clusterrolebinding
  await run(`kubectl create serviceaccount \
    --namespace kube-system tiller
  `);
  await run(`kubectl create clusterrolebinding \
    tiller-cluster-rule \
    --clusterrole=cluster-admin \
    --serviceaccount=kube-system:tiller
  `);

  // Install Helm w/ 'tiller' service account
  await run(`
    helm init \
      --debug \
      --tiller-tls \
      --tiller-tls-cert $(helm home)/tiller.cert.pem \
      --tiller-tls-key $(helm home)/tiller.key.pem \
      --tiller-tls-verify \
      --tls-ca-cert $(helm home)/ca.cert.pem \
      --service-account tiller \
      --wait
  `);

  // Verify helm installation
  await run(`
    helm ls --tls \
      --tls-ca-cert $(helm home)/ca.cert.pem \
      --tls-cert $(helm home)/helm.cert.pem \
      --tls-key $(helm home)/helm.key.pem
  `);

  /**
   *
   * To remove helm:
   *
   * helm reset
   *   --tls
   *   --tls-ca-cert $(helm home)/ca.cert.pem
   *   --tls-cert $(helm home)/helm.cert.pem
   *   --tls-key $(helm home)/helm.key.pem
   */

  // Install nginx ingress
  await run(`
    helm install stable/nginx-ingress \
      --tls \
      --tls-ca-cert $(helm home)/ca.cert.pem \
      --tls-cert $(helm home)/helm.cert.pem \
      --tls-key $(helm home)/helm.key.pem \
      --namespace kube-system \
      --name nginx-ingress \
      --version 0.31.0 \
      --set controller.ingressClass=nginx \
      --set rbac.create=true
  `);

  /**
   * Cert-manager. We need to use an alpha release since it supports
   * certificate generation with SAN's with IP addresses.
   */

  // Install the CustomResourceDefinition resources
  await run('kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.7/deploy/manifests/00-crds.yaml');

  // Add new helm repo for 0.7.0 alpha release of cert-manager
  await run('helm repo add jetstack https://charts.jetstack.io');

  // Create a new namespace for cert-manager
  await run('kubectl create namespace cert-manager');

  // Label the cert-manager namespace to disable resource validation
  await run('kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true');

  // Install cert-manager
  await run(`
    helm install jetstack/cert-manager \
      --tls \
      --tls-ca-cert $(helm home)/ca.cert.pem \
      --tls-cert $(helm home)/helm.cert.pem \
      --tls-key $(helm home)/helm.key.pem \
      --version v0.7.0-alpha.1 \
      --namespace cert-manager \
      --name cert-manager \
      --set ingressShim.defaultIssuerName=letsencrypt-prod \
      --set ingressShim.defaultIssuerKind=ClusterIssuer \
      --set webhook.enabled=false
  `);

  let email = await askForInput(
    'Provide an email address for Let\'s Encrypt'
  );
  while (!(await confirm(`Confirm email: "${email}"`))) {
    email = await askForInput('Provide an email address for Let\'s Encrypt');
  }

  // Create cluster issuer
  await run(`
    cat <<EOF | kubectl create -f -
      {
        "apiVersion": "certmanager.k8s.io/v1alpha1",
        "kind": "ClusterIssuer",
        "metadata": {
          "name": "letsencrypt-prod",
          "namespace": "cert-manager"
        },
        "spec": {
          "acme": {
            "email": "${email}",
            "http01": {},
            "privateKeySecretRef": {
              "name": "letsencrypt-prod"
            },
            "server": "https://acme-v02.api.letsencrypt.org/directory"
          }
        }
      }
    \nEOF`);

  // Create self-signed issuer
  await run(`
    cat <<EOF | kubectl create -f -
      {
        "apiVersion": "certmanager.k8s.io/v1alpha1",
        "kind": "ClusterIssuer",
        "metadata": {
          "name": "selfsigning-issuer"
        },
        "spec": {
          "selfSigned": {}
        }
      }
    \nEOF`);

  // Create global ingress controller
  await run(`
  cat <<EOF | kubectl create -f -
    {
      "apiVersion": "extensions/v1beta1",
      "kind": "Ingress",
      "metadata": {
        "annotations": {
          "ingress.kubernetes.io/ssl-redirect": "true",
          "kubernetes.io/ingress.class": "nginx",
          "kubernetes.io/tls-acme": "true"
        },
        "name": "snow-ingress"
      },
      "spec": {
        "rules": [
          {
            "host": "snow.cluster"
          }
        ]
      }
    }
  \nEOF`);

  // Create persistent storage for docker registry
  await run(`
  cat <<EOF | kubectl create -f -
    {
      "kind": "PersistentVolumeClaim",
      "apiVersion": "v1",
      "metadata": {
        "name": "docker-registry-pvc"
      },
      "spec": {
        "accessModes": [
          "ReadWriteOnce"
        ],
        "volumeMode": "Filesystem",
        "resources": {
          "requests": {
            "storage": "8Gi"
          }
        }
      }
    }
  \nEOF`);

  // Install docker registry
  await run(`
    helm install stable/docker-registry \
      --tls \
      --tls-ca-cert $(helm home)/ca.cert.pem \
      --tls-cert $(helm home)/helm.cert.pem \
      --tls-key $(helm home)/helm.key.pem \
      --namespace default \
      --name docker-registry \
      --version 1.7.0 \
      --set secrets.htpasswd='user:$2y$05$8nR6bYM2ZKR0tkmJ9KEVTeWVVk77sucXVwZQp2q49t6sR0Oip346C' \
      --set persistence.enabled=true \
      --set persistence.existingClaim='docker-registry-pvc' \
      --set tlsSecretName='docker-reg-cert-secret'
  `);

  const {stdout: dockerIP} = await run('kubectl get service/docker-registry -o jsonpath={.spec.clusterIP}');

  // Create certificate for docker registry
  await run(`
  cat <<EOF | kubectl create -f -
    {
      "apiVersion": "certmanager.k8s.io/v1alpha1",
      "kind": "Certificate",
      "metadata": {
        "name": "docker-reg-cert"
      },
      "spec": {
        "secretName": "docker-reg-cert-secret",
        "commonName": "docker-registry.default.svc.cluster.local",
        "ipAddresses": ["${dockerIP}"],
        "isCA": true,
        "issuerRef": {
          "name": "selfsigning-issuer",
          "kind": "ClusterIssuer"
        }
      }
    }
  \nEOF`);

  /*
   * Copy certificate to node VMs daily (to stop the docker
   * daemon from throwing TLS errors when pulling images)
   *
   * You can't mount to a folder to a colon in it, so we copy
   * to a temp folder, rename tls.crt to tls.cert (to make the
   * docker daemon happy), and then place the files in a folder
   * expected by the daemon.
   */
  await run(`
    cat <<EOF | kubectl create -f -
      {
        "kind": "DaemonSet",
        "apiVersion": "apps/v1",
        "metadata": {
          "name": "configure-docker"
        },
        "spec": {
          "selector": {
            "matchLabels": {
              "name": "configure-docker"
            }
          },
          "template": {
            "metadata": {
              "labels": {
                "name": "configure-docker"
              }
            },
            "spec": {
              "volumes": [
                {
                  "name": "etc-folder",
                  "hostPath": {
                    "path": "/etc"
                  }
                },
                {
                  "name": "secrets",
                  "secret": {
                    "secretName": "docker-reg-cert-secret"
                  }
                }
              ],
              "containers": [
                {
                  "name": "configure-docker-container",
                  "image": "alpine",
                  "args": [
                    "sh",
                    "-c",
                    "${[
                      'mkdir -p /dockertmp;',
                      'cp /dockercert/* /dockertmp;',
                      'cp /dockertmp/tls.crt /dockertmp/tls.cert;',
                      `mkdir -p /node/etc/docker/certs.d/${dockerIP}:5000;`,
                      `cp /dockertmp/* /node/etc/docker/certs.d/${dockerIP}:5000;`,
                      'sleep 86400;'
                    ].join(' ')}"
                  ],
                  "volumeMounts": [
                    {
                      "name": "etc-folder",
                      "mountPath": "/node/etc"
                    },
                    {
                      "name": "secrets",
                      "mountPath": "/dockercert"
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    \nEOF
  `);

  // Create secret/regcred to store registry credentials
  await run(`kubectl create secret docker-registry regcred --docker-server=${dockerIP}:5000 --docker-username=user --docker-password=password`);

  // Create ConfigMap for credentials
  await run(`
    cat <<EOF | kubectl create -f -
      {
        "apiVersion": "v1",
        "kind": "ConfigMap",
        "metadata": {
          "name": "docker-config"
        },
        "data": {
          "config.json": "{\\"auths\\":{\\"${dockerIP}:5000\\":{\\"username\\":\\"user\\",\\"password\\":\\"password\\"}}}"
        }
      }
    \nEOF
  `);

  logInfo('🎉  Cluster created! In a few moments, your cluster IP will be available.');
  logInfo('🎉  Get it by running \'snow ip\'. Create a DNS \'A\' record for hostnames');
  logInfo('🎉  you wish to point to your cluster.');
};
