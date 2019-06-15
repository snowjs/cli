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
var path = require('path');
var providers_1 = require('./providers');
var utils_1 = require('./utils');
exports['default'] = function() {
  return __awaiter(_this, void 0, void 0, function() {
    var question,
      provider,
      _a,
      error_1,
      minikubeIP,
      traefikHost,
      deployFile,
      whoAmIHost,
      completeMsg,
      stdout,
      isAuthenticated,
      error_2,
      projectId,
      clusterExists,
      clusterData,
      createClusterCmd,
      token,
      clusterExists,
      e_1,
      region,
      name,
      BYTES,
      config,
      tillerConfig,
      email,
      dockerIP;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          question = 'Which cloud provider are you hosting with';
          return [
            4 /*yield*/,
            utils_1.pickOne(question, providers_1['default'])
          ];
        case 1:
          provider = _b.sent();
          _a = provider;
          switch (_a) {
            case 'minikube':
              return [3 /*break*/, 2];
            case 'gcp':
              return [3 /*break*/, 16];
            case 'digitalocean':
              return [3 /*break*/, 28];
          }
          return [3 /*break*/, 39];
        case 2:
          utils_1.logInfo('Note: Minikube is for development purposes only.');
          _b.label = 3;
        case 3:
          _b.trys.push([3, 5, , 7]);
          return [4 /*yield*/, utils_1.run('minikube status')];
        case 4:
          _b.sent();
          return [3 /*break*/, 7];
        case 5:
          error_1 = _b.sent();
          utils_1.logInfo('Starting Minikube. This may take a minute.');
          return [4 /*yield*/, utils_1.run('minikube start')];
        case 6:
          _b.sent();
          return [3 /*break*/, 7];
        case 7:
          return [4 /*yield*/, utils_1.run('minikube addons enable ingress')];
        case 8:
          _b.sent();
          return [4 /*yield*/, utils_1.run('helm init --wait')];
        case 9:
          _b.sent();
          return [4 /*yield*/, utils_1.run('minikube ip')];
        case 10:
          minikubeIP = _b.sent().stdout;
          // Install traefik
          return [
            4 /*yield*/,
            utils_1.run(
              '\n        helm install stable/traefik         --name traefik         --namespace kube-system         --set serviceType=NodePort         --set dashboard.enabled=true         --set dashboard.domain=traefik-ui.minikube\n      '
            )
          ];
        case 11:
          // Install traefik
          _b.sent();
          traefikHost = minikubeIP + ' traefik-ui.minikube';
          utils_1.logInfo(
            'Add "' +
              traefikHost +
              '" to your hosts file to access traefik\'s dashboard.'
          );
          // Install docker registry
          return [
            4 /*yield*/,
            utils_1.run('helm install stable/docker-registry')
          ];
        case 12:
          // Install docker registry
          _b.sent();
          return [
            4 /*yield*/,
            utils_1.confirm('Install an example app on Minikube')
          ];
        case 13:
          if (!_b.sent()) return [3 /*break*/, 15];
          deployFile = path.resolve(
            __dirname,
            '../config/deployment-minikube.yaml'
          );
          return [4 /*yield*/, utils_1.run('kubectl apply -f ' + deployFile)];
        case 14:
          _b.sent();
          whoAmIHost = minikubeIP + ' whoami.minikube';
          utils_1.logInfo(
            'Add "' + whoAmIHost + '" to your hosts file to access example app.'
          );
          _b.label = 15;
        case 15:
          completeMsg =
            'Creation complete. It may take a few minutes for services to become available.';
          utils_1.logInfo(completeMsg);
          return [3 /*break*/, 40];
        case 16:
          _b.trys.push([16, 20, , 22]);
          return [4 /*yield*/, utils_1.run('gcloud auth list')];
        case 17:
          stdout = _b.sent().stdout;
          isAuthenticated = stdout.indexOf('*') > -1;
          if (!!isAuthenticated) return [3 /*break*/, 19];
          return [4 /*yield*/, utils_1.run('gcloud auth login')];
        case 18:
          _b.sent();
          _b.label = 19;
        case 19:
          return [3 /*break*/, 22];
        case 20:
          error_2 = _b.sent();
          return [4 /*yield*/, utils_1.run('gcloud auth login')];
        case 21:
          _b.sent();
          return [3 /*break*/, 22];
        case 22:
          return [4 /*yield*/, utils_1.run('gcloud config get-value project')];
        case 23:
          projectId = _b.sent().stdout;
          return [
            4 /*yield*/,
            utils_1.run('gcloud services enable container.googleapis.com')
          ];
        case 24:
          _b.sent();
          clusterExists = false;
          return [4 /*yield*/, utils_1.run('gcloud container clusters list')];
        case 25:
          clusterData = _b.sent().stdout;
          if (clusterData.indexOf('snow-cluster') > -1) {
            clusterExists = true;
          }
          createClusterCmd =
            '\n        gcloud beta container           clusters create "snow-cluster"           --zone "us-west1-b"           --no-enable-basic-auth           --cluster-version "1.10.9-gke.5"           --image-type "COS"           --machine-type "f1-micro"           --disk-type "pd-standard"           --disk-size "10"           --default-max-pods-per-node "110"           --num-nodes "3"           --enable-cloud-logging           --enable-cloud-monitoring           --enable-ip-alias           --network "projects/' +
            projectId +
            '/global/networks/default"           --subnetwork "projects/' +
            projectId +
            '/regions/us-west1/subnetworks/default"           --default-max-pods-per-node "110"           --addons HorizontalPodAutoscaling,HttpLoadBalancing           --enable-autoupgrade           --enable-autorepair           --scopes "https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/trace.append"       ';
          if (!!clusterExists) return [3 /*break*/, 27];
          return [4 /*yield*/, utils_1.run(createClusterCmd)];
        case 26:
          _b.sent();
          _b.label = 27;
        case 27:
          return [3 /*break*/, 40];
        case 28:
          // Authenticate.
          utils_1.logInfo(
            'Obtain a Digital Ocean access token here: https://cloud.digitalocean.com/account/api/tokens'
          );
          return [
            4 /*yield*/,
            utils_1.askForInput('Enter your digital ocean access token')
          ];
        case 29:
          token = _b.sent();
          return [4 /*yield*/, utils_1.run('doctl auth init -t ' + token)];
        case 30:
          _b.sent();
          clusterExists = true;
          _b.label = 31;
        case 31:
          _b.trys.push([31, 33, , 34]);
          return [
            4 /*yield*/,
            utils_1.run('doctl k8s cluster get snow-cluster', { silent: true })
          ];
        case 32:
          _b.sent();
          return [3 /*break*/, 34];
        case 33:
          e_1 = _b.sent();
          clusterExists = false;
          return [3 /*break*/, 34];
        case 34:
          region = 'nyc1';
          name = 'snow-cluster';
          if (!!clusterExists) return [3 /*break*/, 36];
          // Create the cluster.
          utils_1.logInfo('Creating cluster. This will take a few minutes...');
          return [
            4 /*yield*/,
            utils_1.run(
              '\n          doctl k8s clusters create ' +
                name +
                '             --region ' +
                region +
                '             --version 1.13.1-do.2             --node-pool "name=node-pool-0;size=s-1vcpu-2gb;count=2"             --wait\n        '
            )
          ];
        case 35:
          _b.sent();
          return [3 /*break*/, 37];
        case 36:
          utils_1.logInfo('Cluster exists.');
          _b.label = 37;
        case 37:
          return [
            4 /*yield*/,
            utils_1.run('kubectl config use-context do-' + region + '-' + name)
          ];
        case 38:
          _b.sent();
          return [3 /*break*/, 40];
        case 39:
          {
            utils_1.logError('No valid cloud provider selected.');
          }
          _b.label = 40;
        case 40:
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
          return [4 /*yield*/, utils_1.run('helm init --client-only')];
        case 41:
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
          _b.sent();
          BYTES = 2048;
          // Create Certificate Authority
          return [
            4 /*yield*/,
            utils_1.run('openssl genrsa -out $(helm home)/ca.key.pem ' + BYTES)
          ];
        case 42:
          // Create Certificate Authority
          _b.sent();
          config =
            '\n    [req]\\n\n    req_extensions=v3_ca\\n\n    distinguished_name=req_distinguished_name\\n\n    [req_distinguished_name]\\n\n    [ v3_ca ]\\n\n    basicConstraints=critical,CA:TRUE\\n\n    subjectKeyIdentifier=hash\\n\n    authorityKeyIdentifier=keyid:always,issuer:always';
          return [
            4 /*yield*/,
            utils_1.run(
              "\n    openssl req \\\n      -config <(printf '" +
                config +
                '\') \\\n      -key $(helm home)/ca.key.pem \\\n      -new \\\n      -x509 \\\n      -days 7300 \\\n      -sha256 \\\n      -out $(helm home)/ca.cert.pem \\\n      -extensions v3_ca \\\n      -subj "/C=US"',
              { shell: '/bin/bash' }
            )
          ];
        case 43:
          _b.sent();
          // Create credentials for tiller (server)
          return [
            4 /*yield*/,
            utils_1.run(
              'openssl genrsa -out $(helm home)/tiller.key.pem ' + BYTES
            )
          ];
        case 44:
          // Create credentials for tiller (server)
          _b.sent();
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    openssl req       -new       -sha256       -key $(helm home)/tiller.key.pem       -out $(helm home)/tiller.csr.pem       -subj "/C=US/O=Snow/CN=tiller-server"',
              { shell: '/bin/bash' }
            )
          ];
        case 45:
          _b.sent();
          tillerConfig = '\n    [SAN]\\n\n    subjectAltName=IP:127.0.0.1';
          return [
            4 /*yield*/,
            utils_1.run(
              "\n    openssl x509 -req -days 365       -CA $(helm home)/ca.cert.pem       -CAkey $(helm home)/ca.key.pem       -CAcreateserial       -in $(helm home)/tiller.csr.pem       -out $(helm home)/tiller.cert.pem       -extfile <(printf '" +
                tillerConfig +
                "')       -extensions SAN",
              { shell: '/bin/bash' }
            )
          ];
        case 46:
          _b.sent();
          // Create credentials for helm (client)
          return [
            4 /*yield*/,
            utils_1.run(
              'openssl genrsa -out $(helm home)/helm.key.pem ' + BYTES
            )
          ];
        case 47:
          // Create credentials for helm (client)
          _b.sent();
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    openssl req -new -sha256       -key $(helm home)/helm.key.pem       -out $(helm home)/helm.csr.pem       -subj "/C=US"\n  '
            )
          ];
        case 48:
          _b.sent();
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    openssl x509 -req -days 365       -CA $(helm home)/ca.cert.pem       -CAkey $(helm home)/ca.key.pem       -CAcreateserial       -in $(helm home)/helm.csr.pem       -out $(helm home)/helm.cert.pem\n  '
            )
          ];
        case 49:
          _b.sent();
          // Create service account and clusterrolebinding
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl create serviceaccount     --namespace kube-system tiller\n  '
            )
          ];
        case 50:
          // Create service account and clusterrolebinding
          _b.sent();
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl create clusterrolebinding     tiller-cluster-rule     --clusterrole=cluster-admin     --serviceaccount=kube-system:tiller\n  '
            )
          ];
        case 51:
          _b.sent();
          // Install Helm w/ 'tiller' service account
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    helm init       --debug       --tiller-tls       --tiller-tls-cert $(helm home)/tiller.cert.pem       --tiller-tls-key $(helm home)/tiller.key.pem       --tiller-tls-verify       --tls-ca-cert $(helm home)/ca.cert.pem       --service-account tiller       --wait\n  '
            )
          ];
        case 52:
          // Install Helm w/ 'tiller' service account
          _b.sent();
          // Verify helm installation
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    helm ls --tls       --tls-ca-cert $(helm home)/ca.cert.pem       --tls-cert $(helm home)/helm.cert.pem       --tls-key $(helm home)/helm.key.pem\n  '
            )
          ];
        case 53:
          // Verify helm installation
          _b.sent();
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
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    helm install stable/nginx-ingress       --tls       --tls-ca-cert $(helm home)/ca.cert.pem       --tls-cert $(helm home)/helm.cert.pem       --tls-key $(helm home)/helm.key.pem       --namespace kube-system       --name nginx-ingress       --version 0.31.0       --set controller.ingressClass=nginx       --set rbac.create=true\n  '
            )
          ];
        case 54:
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
          _b.sent();
          /**
           * Cert-manager. We need to use an alpha release since it supports
           * certificate generation with SAN's with IP addresses.
           */
          // Install the CustomResourceDefinition resources
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.7/deploy/manifests/00-crds.yaml'
            )
          ];
        case 55:
          /**
           * Cert-manager. We need to use an alpha release since it supports
           * certificate generation with SAN's with IP addresses.
           */
          // Install the CustomResourceDefinition resources
          _b.sent();
          // Add new helm repo for 0.7.0 alpha release of cert-manager
          return [
            4 /*yield*/,
            utils_1.run('helm repo add jetstack https://charts.jetstack.io')
          ];
        case 56:
          // Add new helm repo for 0.7.0 alpha release of cert-manager
          _b.sent();
          // Create a new namespace for cert-manager
          return [
            4 /*yield*/,
            utils_1.run('kubectl create namespace cert-manager')
          ];
        case 57:
          // Create a new namespace for cert-manager
          _b.sent();
          // Label the cert-manager namespace to disable resource validation
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true'
            )
          ];
        case 58:
          // Label the cert-manager namespace to disable resource validation
          _b.sent();
          // Install cert-manager
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    helm install jetstack/cert-manager       --tls       --tls-ca-cert $(helm home)/ca.cert.pem       --tls-cert $(helm home)/helm.cert.pem       --tls-key $(helm home)/helm.key.pem       --version v0.7.0-alpha.1       --namespace cert-manager       --name cert-manager       --set ingressShim.defaultIssuerName=letsencrypt-prod       --set ingressShim.defaultIssuerKind=ClusterIssuer       --set webhook.enabled=false\n  '
            )
          ];
        case 59:
          // Install cert-manager
          _b.sent();
          return [
            4 /*yield*/,
            utils_1.askForInput("Provide an email address for Let's Encrypt")
          ];
        case 60:
          email = _b.sent();
          _b.label = 61;
        case 61:
          return [
            4 /*yield*/,
            utils_1.confirm('Confirm email: "' + email + '"')
          ];
        case 62:
          if (!!_b.sent()) return [3 /*break*/, 64];
          return [
            4 /*yield*/,
            utils_1.askForInput("Provide an email address for Let's Encrypt")
          ];
        case 63:
          email = _b.sent();
          return [3 /*break*/, 61];
        case 64:
          // Create cluster issuer
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    cat <<EOF | kubectl create -f -\n      {\n        "apiVersion": "certmanager.k8s.io/v1alpha1",\n        "kind": "ClusterIssuer",\n        "metadata": {\n          "name": "letsencrypt-prod",\n          "namespace": "cert-manager"\n        },\n        "spec": {\n          "acme": {\n            "email": "' +
                email +
                '",\n            "http01": {},\n            "privateKeySecretRef": {\n              "name": "letsencrypt-prod"\n            },\n            "server": "https://acme-v02.api.letsencrypt.org/directory"\n          }\n        }\n      }\n    \nEOF'
            )
          ];
        case 65:
          // Create cluster issuer
          _b.sent();
          // Create self-signed issuer
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    cat <<EOF | kubectl create -f -\n      {\n        "apiVersion": "certmanager.k8s.io/v1alpha1",\n        "kind": "ClusterIssuer",\n        "metadata": {\n          "name": "selfsigning-issuer"\n        },\n        "spec": {\n          "selfSigned": {}\n        }\n      }\n    \nEOF'
            )
          ];
        case 66:
          // Create self-signed issuer
          _b.sent();
          // Create global ingress controller
          return [
            4 /*yield*/,
            utils_1.run(
              '\n  cat <<EOF | kubectl create -f -\n    {\n      "apiVersion": "extensions/v1beta1",\n      "kind": "Ingress",\n      "metadata": {\n        "annotations": {\n          "ingress.kubernetes.io/ssl-redirect": "true",\n          "kubernetes.io/ingress.class": "nginx",\n          "kubernetes.io/tls-acme": "true"\n        },\n        "name": "snow-ingress"\n      },\n      "spec": {\n        "rules": [\n          {\n            "host": "snow.cluster"\n          }\n        ]\n      }\n    }\n  \nEOF'
            )
          ];
        case 67:
          // Create global ingress controller
          _b.sent();
          // Create persistent storage for docker registry
          return [
            4 /*yield*/,
            utils_1.run(
              '\n  cat <<EOF | kubectl create -f -\n    {\n      "kind": "PersistentVolumeClaim",\n      "apiVersion": "v1",\n      "metadata": {\n        "name": "docker-registry-pvc"\n      },\n      "spec": {\n        "accessModes": [\n          "ReadWriteOnce"\n        ],\n        "volumeMode": "Filesystem",\n        "resources": {\n          "requests": {\n            "storage": "8Gi"\n          }\n        }\n      }\n    }\n  \nEOF'
            )
          ];
        case 68:
          // Create persistent storage for docker registry
          _b.sent();
          // Install docker registry
          return [
            4 /*yield*/,
            utils_1.run(
              "\n    helm install stable/docker-registry       --tls       --tls-ca-cert $(helm home)/ca.cert.pem       --tls-cert $(helm home)/helm.cert.pem       --tls-key $(helm home)/helm.key.pem       --namespace default       --name docker-registry       --version 1.7.0       --set secrets.htpasswd='user:$2y$05$8nR6bYM2ZKR0tkmJ9KEVTeWVVk77sucXVwZQp2q49t6sR0Oip346C'       --set persistence.enabled=true       --set persistence.existingClaim='docker-registry-pvc'       --set tlsSecretName='docker-reg-cert-secret'\n  "
            )
          ];
        case 69:
          // Install docker registry
          _b.sent();
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl get service/docker-registry -o jsonpath={.spec.clusterIP}'
            )
          ];
        case 70:
          dockerIP = _b.sent().stdout;
          // Create certificate for docker registry
          return [
            4 /*yield*/,
            utils_1.run(
              '\n  cat <<EOF | kubectl create -f -\n    {\n      "apiVersion": "certmanager.k8s.io/v1alpha1",\n      "kind": "Certificate",\n      "metadata": {\n        "name": "docker-reg-cert"\n      },\n      "spec": {\n        "secretName": "docker-reg-cert-secret",\n        "commonName": "docker-registry.default.svc.cluster.local",\n        "ipAddresses": ["' +
                dockerIP +
                '"],\n        "isCA": true,\n        "issuerRef": {\n          "name": "selfsigning-issuer",\n          "kind": "ClusterIssuer"\n        }\n      }\n    }\n  \nEOF'
            )
          ];
        case 71:
          // Create certificate for docker registry
          _b.sent();
          /*
           * Copy certificate to node VMs daily (to stop the docker
           * daemon from throwing TLS errors when pulling images)
           *
           * You can't mount to a folder to a colon in it, so we copy
           * to a temp folder, rename tls.crt to tls.cert (to make the
           * docker daemon happy), and then place the files in a folder
           * expected by the daemon.
           */
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    cat <<EOF | kubectl create -f -\n      {\n        "kind": "DaemonSet",\n        "apiVersion": "apps/v1",\n        "metadata": {\n          "name": "configure-docker"\n        },\n        "spec": {\n          "selector": {\n            "matchLabels": {\n              "name": "configure-docker"\n            }\n          },\n          "template": {\n            "metadata": {\n              "labels": {\n                "name": "configure-docker"\n              }\n            },\n            "spec": {\n              "volumes": [\n                {\n                  "name": "etc-folder",\n                  "hostPath": {\n                    "path": "/etc"\n                  }\n                },\n                {\n                  "name": "secrets",\n                  "secret": {\n                    "secretName": "docker-reg-cert-secret"\n                  }\n                }\n              ],\n              "containers": [\n                {\n                  "name": "configure-docker-container",\n                  "image": "alpine",\n                  "args": [\n                    "sh",\n                    "-c",\n                    "' +
                [
                  'mkdir -p /dockertmp;',
                  'cp /dockercert/* /dockertmp;',
                  'cp /dockertmp/tls.crt /dockertmp/tls.cert;',
                  'mkdir -p /node/etc/docker/certs.d/' + dockerIP + ':5000;',
                  'cp /dockertmp/* /node/etc/docker/certs.d/' +
                    dockerIP +
                    ':5000;',
                  'sleep 86400;'
                ].join(' ') +
                '"\n                  ],\n                  "volumeMounts": [\n                    {\n                      "name": "etc-folder",\n                      "mountPath": "/node/etc"\n                    },\n                    {\n                      "name": "secrets",\n                      "mountPath": "/dockercert"\n                    }\n                  ]\n                }\n              ]\n            }\n          }\n        }\n      }\n    \nEOF\n  '
            )
          ];
        case 72:
          /*
           * Copy certificate to node VMs daily (to stop the docker
           * daemon from throwing TLS errors when pulling images)
           *
           * You can't mount to a folder to a colon in it, so we copy
           * to a temp folder, rename tls.crt to tls.cert (to make the
           * docker daemon happy), and then place the files in a folder
           * expected by the daemon.
           */
          _b.sent();
          // Create secret/regcred to store registry credentials
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl create secret docker-registry regcred --docker-server=' +
                dockerIP +
                ':5000 --docker-username=user --docker-password=password'
            )
          ];
        case 73:
          // Create secret/regcred to store registry credentials
          _b.sent();
          // Create ConfigMap for credentials
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    cat <<EOF | kubectl create -f -\n      {\n        "apiVersion": "v1",\n        "kind": "ConfigMap",\n        "metadata": {\n          "name": "docker-config"\n        },\n        "data": {\n          "config.json": "{\\"auths\\":{\\"' +
                dockerIP +
                ':5000\\":{\\"username\\":\\"user\\",\\"password\\":\\"password\\"}}}"\n        }\n      }\n    \nEOF\n  '
            )
          ];
        case 74:
          // Create ConfigMap for credentials
          _b.sent();
          utils_1.logInfo(
            '🎉  Cluster created! In a few moments, your cluster IP will be available.'
          );
          utils_1.logInfo(
            "🎉  Get it by running 'snow ip'. Create a DNS 'A' record for hostnames"
          );
          utils_1.logInfo('🎉  you wish to point to your cluster.');
          return [2 /*return*/];
      }
    });
  });
};
//# sourceMappingURL=create.js.map
