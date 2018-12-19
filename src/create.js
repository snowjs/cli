const path = require('path');
const chalk = require('chalk');
const {exec, pickOne, run} = require('./utils');

module.exports = async function () {
  const cloudProviders = ['minikube', 'gcp'];
  const question = 'Which cloud provider are you hosting with (minikube,gcp)';
  const provider = await pickOne(question, cloudProviders);
  switch (provider) {
    case 'minikube': {
      const msgs = [
        'Note: Minikube is for development purposes only.',
        'Starting Minikube. This may take a minute.'
      ];
      const msg = chalk.bold.white(msgs.join('\n'));
      console.log(msg);
      await run('minikube start');
      await run('minikube addons enable ingress');
      await run('helm init --wait');

      // Install traefik and kaniko
      await run('helm install stable/traefik --name traefik --namespace kube-system --set serviceType=NodePort,dashboard.enabled=true,dashboard.domain=traefik-ui.minikube');
      // Put an example deployment on the server
      // await run('kubectl run whoami --image=emilevauge/whoami --port=80 --replicas=5 --expose');
      // await run('kubectl apply -f whoami-ingress.yml');
      // await run(`kubectl apply -f ${path.resolve(__dirname, '../config/kaniko.yaml')}`);
      break;
    }
    case 'gcp': {
      // Check if we need to authenticate.
      try {
        const {stdout} = await exec('gcloud auth list');
        const isAuthenticated = stdout.indexOf('*') > -1;
        if (!isAuthenticated) {
          await run('gcloud auth login');
        }
      } catch (error) {
        await run('gcloud auth login');
      }

      const {stdout} = await exec('gcloud config get-value project');
      const projectId = stdout.trim();
      await run('gcloud services enable container.googleapis.com');
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
      await run(createClusterCmd);
      break;
    }
    default: {
      console.log(chalk.bold.red('No valid cloud provider selected.'));
    }
  }
};
