'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var _this = this;
exports.__esModule = true;
var parser = require('docker-file-parser');
var path = require('path');
var utils_1 = require('./utils');
function verifyNowJSON(_a) {
  var alias = _a.alias,
    name = _a.name;
  if (!name) {
    var msg = 'Specify a "name" (string) property in snow.json';
    utils_1.logError(msg);
    return Promise.reject();
  }
  if (!alias) {
    var msg = 'Specify an "alias" (string[]) property in snow.json';
    utils_1.logError(msg);
    return Promise.reject();
  }
  return Promise.resolve();
}
function getDockerfilePort(commands) {
  var dockerFilePort;
  commands.forEach(function(_a) {
    var args = _a.args,
      name = _a.name;
    if (name !== 'EXPOSE') {
      return;
    }
    console.log('args is', args);
    if (typeof args === 'string') {
      var port = args.match(/\d/g);
      if (port) {
        dockerFilePort = port.join('');
      }
    } else if (Array.isArray(args)) {
      var argsAsString = args.join(' ');
      var port = argsAsString.match(/\d/g);
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
exports['default'] = function() {
  return __awaiter(_this, void 0, void 0, function() {
    var dockerFile,
      dockerFilePath,
      content,
      error_1,
      msg,
      nowFilePath,
      nowConfig,
      nowFile,
      error_2,
      msg,
      name,
      files,
      deployment,
      revision,
      deploymentStr,
      generation,
      e_1,
      pvcName,
      uploadPodPrefix,
      podName,
      contName,
      dockerIP,
      kanikoJobName,
      imageName,
      dockerFilePort,
      e_2,
      deploymentSpec,
      deploymentPatchString,
      e_3;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          dockerFilePath = path.resolve(process.cwd(), 'Dockerfile');
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [4 /*yield*/, utils_1.readFile(dockerFilePath)];
        case 2:
          content = _a.sent();
          dockerFile = parser.parse(content.toString());
          return [3 /*break*/, 4];
        case 3:
          error_1 = _a.sent();
          msg = 'Error finding Dockerfile.\n' + error_1.message;
          utils_1.logError(msg);
          return [2 /*return*/];
        case 4:
          nowFilePath = path.resolve(process.cwd(), 'snow.json');
          _a.label = 5;
        case 5:
          _a.trys.push([5, 7, , 8]);
          return [4 /*yield*/, utils_1.readFile(nowFilePath)];
        case 6:
          nowFile = _a.sent();
          nowConfig = JSON.parse(nowFile.toString());
          return [3 /*break*/, 8];
        case 7:
          error_2 = _a.sent();
          msg = 'Error reading snow.json.\n' + error_2.message;
          utils_1.logError(msg);
          return [2 /*return*/];
        case 8:
          verifyNowJSON(nowConfig);
          (name = nowConfig.name), (files = nowConfig.files);
          _a.label = 9;
        case 9:
          _a.trys.push([9, 11, , 12]);
          return [
            4 /*yield*/,
            utils_1.run('kubectl get deployments/' + name + ' -o json')
          ];
        case 10:
          deploymentStr = _a.sent().stdout;
          // Deployment exists. Update it.
          deployment = JSON.parse(deploymentStr);
          generation = JSON.parse(deploymentStr).metadata.generation;
          revision = generation + 1;
          return [3 /*break*/, 12];
        case 11:
          e_1 = _a.sent();
          // No deployment exists.
          revision = 1;
          return [3 /*break*/, 12];
        case 12:
          pvcName = name + '-buildctx';
          return [
            4 /*yield*/,
            utils_1.run(
              '\n  cat <<EOF | kubectl create -f -\n    {\n      "kind": "PersistentVolumeClaim",\n      "apiVersion": "v1",\n      "metadata": {\n        "name": "' +
                pvcName +
                '"\n      },\n      "spec": {\n        "accessModes": [\n          "ReadWriteOnce"\n        ],\n        "volumeMode": "Filesystem",\n        "resources": {\n          "requests": {\n            "storage": "1Gi"\n          }\n        }\n      }\n    }\n  \nEOF'
            )
          ];
        case 13:
          _a.sent();
          uploadPodPrefix = name + '-bctx';
          podName = uploadPodPrefix + '-pod';
          contName = uploadPodPrefix + '-cont';
          return [
            4 /*yield*/,
            utils_1.run(
              '\n  cat <<EOF | kubectl create -f -\n    {\n      "kind": "Pod",\n      "apiVersion": "v1",\n      "metadata": {\n        "name": "' +
                podName +
                '"\n      },\n      "spec": {\n        "volumes": [\n          {\n            "name": "storage",\n            "persistentVolumeClaim": {\n              "claimName": "' +
                pvcName +
                '"\n            }\n          }\n        ],\n        "containers": [\n          {\n            "name": "' +
                contName +
                '",\n            "image": "alpine",\n            "args": [\n              "sh",\n              "-c",\n              "while true; do sleep 1; if [ -f /tmp/complete ]; then break; fi done"\n            ],\n            "volumeMounts": [\n              {\n                "mountPath": "/kaniko/build-context",\n                "name": "storage"\n              }\n            ]\n          }\n        ]\n      }\n    }\n  \nEOF'
            )
          ];
        case 14:
          _a.sent();
          // Create build context tarball.
          return [
            4 /*yield*/,
            utils_1.run(
              'tar cvfz buildcontext.tar.gz Dockerfile ' + files.join(' ')
            )
          ];
        case 15:
          // Create build context tarball.
          _a.sent();
          // Wait for pod to be ready.
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl wait pods/' +
                podName +
                ' --timeout=60s --for condition=Ready'
            )
          ];
        case 16:
          // Wait for pod to be ready.
          _a.sent();
          // Copy build context to container
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl cp -c ' +
                contName +
                ' buildcontext.tar.gz ' +
                podName +
                ':/tmp/buildcontext.tar.gz'
            )
          ];
        case 17:
          // Copy build context to container
          _a.sent();
          // Untar the build context
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl exec ' +
                podName +
                ' -c ' +
                contName +
                ' -- tar -zxf /tmp/buildcontext.tar.gz -C /kaniko/build-context'
            )
          ];
        case 18:
          // Untar the build context
          _a.sent();
          // Mark the upload process as complete
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl exec ' +
                podName +
                ' -c ' +
                contName +
                ' -- touch /tmp/complete'
            )
          ];
        case 19:
          // Mark the upload process as complete
          _a.sent();
          // Delete the pod so we can attach the PVC to a new pod
          return [4 /*yield*/, utils_1.run('kubectl delete pod/' + podName)];
        case 20:
          // Delete the pod so we can attach the PVC to a new pod
          _a.sent();
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl get service/docker-registry -o jsonpath={.spec.clusterIP}'
            )
          ];
        case 21:
          dockerIP = _a.sent().stdout;
          kanikoJobName = podName + '-kaniko';
          imageName = dockerIP + ':5000/' + name + ':' + revision;
          return [
            4 /*yield*/,
            utils_1.run(
              '\n  cat <<EOF | kubectl create -f -\n    {\n      "apiVersion": "batch/v1",\n      "kind": "Job",\n      "metadata": {\n        "name": "' +
                kanikoJobName +
                '"\n      },\n      "spec": {\n        "template": {\n          "spec": {\n            "restartPolicy": "Never",\n            "volumes": [\n              {\n                "name": "docker-config",\n                "secret": {\n                  "secretName": "regcred",\n                  "items": [\n                    {\n                      "key": ".dockerconfigjson",\n                      "path": "config.json"\n                    }\n                  ]\n                }\n              },\n              {\n                "name": "storage",\n                "persistentVolumeClaim": {\n                  "claimName": "' +
                pvcName +
                '"\n                }\n              }\n            ],\n            "containers": [\n              {\n                "name": "kaniko",\n                "image": "gcr.io/kaniko-project/executor:0.7.0",\n                "args": [\n                  "--context=dir:///kaniko/build-context",\n                  "--destination=' +
                imageName +
                '",\n                  "--skip-tls-verify"\n                ],\n                "volumeMounts": [\n                  {\n                    "name": "storage",\n                    "mountPath": "/kaniko/build-context"\n                  },\n                  {\n                    "name": "docker-config",\n                    "mountPath": "/kaniko/.docker"\n                  }\n                ]\n              }\n            ]\n          }\n        }\n      }\n    }\n  \nEOF'
            )
          ];
        case 22:
          _a.sent();
          // Wait for Kaniko to complete / push to Docker registry.
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl wait jobs/' +
                kanikoJobName +
                ' --timeout=' +
                60 * 10 +
                's --for=condition=complete'
            )
          ];
        case 23:
          // Wait for Kaniko to complete / push to Docker registry.
          _a.sent();
          // Cleanup
          // Delete kaniko pod and PVC.
          return [
            4 /*yield*/,
            utils_1.run('kubectl delete jobs/' + kanikoJobName)
          ];
        case 24:
          // Cleanup
          // Delete kaniko pod and PVC.
          _a.sent();
          return [4 /*yield*/, utils_1.run('kubectl delete pvc/' + pvcName)];
        case 25:
          _a.sent();
          _a.label = 26;
        case 26:
          _a.trys.push([26, 28, , 29]);
          return [4 /*yield*/, getDockerfilePort(dockerFile)];
        case 27:
          dockerFilePort = _a.sent();
          return [3 /*break*/, 29];
        case 28:
          e_2 = _a.sent();
          utils_1.logError(
            'Could not find port in Dockerfile. Did you define an EXPOSE command?'
          );
          return [2 /*return*/];
        case 29:
          if (!!deployment) return [3 /*break*/, 31];
          // No deployment exists. Create one.
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    cat <<EOF | kubectl create -f -\n      {\n        "apiVersion": "extensions/v1beta1",\n        "kind": "Deployment",\n        "metadata": {\n          "name": "' +
                name +
                '"\n        },\n        "spec": {\n          "template": {\n            "metadata": {\n              "labels": {\n                "app": "' +
                name +
                '"\n              }\n            },\n            "spec": {\n              "containers": [\n                {\n                  "name": "' +
                name +
                '",\n                  "image": "' +
                imageName +
                '",\n                  "ports": [\n                    {\n                      "name": "app-port",\n                      "containerPort": ' +
                dockerFilePort +
                '\n                    }\n                  ]\n                }\n              ],\n              "imagePullSecrets": [\n                {\n                  "name": "regcred"\n                }\n              ]\n            }\n          }\n        }\n      }\n    \nEOF'
            )
          ];
        case 30:
          // No deployment exists. Create one.
          _a.sent();
          return [3 /*break*/, 33];
        case 31:
          deploymentSpec = deployment.spec;
          deploymentSpec.template.spec.containers[0].image = imageName;
          deploymentPatchString = JSON.stringify({ spec: deploymentSpec });
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl patch deployment/' +
                name +
                " --patch '" +
                deploymentPatchString +
                "'"
            )
          ];
        case 32:
          _a.sent();
          _a.label = 33;
        case 33:
          _a.trys.push([33, 35, , 37]);
          return [
            4 /*yield*/,
            utils_1.run('kubectl get services/' + name + ' -o json')
          ];
        case 34:
          _a.sent();
          return [3 /*break*/, 37];
        case 35:
          e_3 = _a.sent();
          // No service object exists. Create one.
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    cat <<EOF | kubectl create -f -\n      {\n        "apiVersion": "v1",\n        "kind": "Service",\n        "metadata": {\n          "name": "' +
                name +
                '",\n          "labels": {\n            "app": "' +
                name +
                '"\n          }\n        },\n        "spec": {\n          "type": "NodePort",\n          "selector": {\n            "app": "' +
                name +
                '"\n          },\n          "ports": [\n            {\n              "port": 8080,\n              "targetPort": "app-port"\n            }\n          ]\n        }\n      }\n    \nEOF'
            )
          ];
        case 36:
          // No service object exists. Create one.
          _a.sent();
          return [3 /*break*/, 37];
        case 37:
          return [2 /*return*/];
      }
    });
  });
};
//# sourceMappingURL=deploy.js.map
