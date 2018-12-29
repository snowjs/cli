const path = require('path');
const {confirm, logError, logInfo, pickOne, run} = require('./utils');

module.exports = async function () {
  const cloudProviders = ['minikube', 'gcp'];
  const question = 'Which cloud provider are you hosting with';
  const provider = await pickOne(question, cloudProviders);
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

      const {stdout: minikubeIP} = await run('minikube ip');

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
      logInfo(`Add "${traefikHost}" to your hosts file to access traefik's dashboard.`);

      // Install docker registry
      await run('helm install stable/docker-registry');

      if (await confirm('Install an example app on Minikube')) {
        const deployFile = path.resolve(__dirname, '../config/deployment-minikube.yaml');
        await run(`kubectl apply -f ${deployFile}`);
        const whoAmIHost = `${minikubeIP} whoami.minikube`;
        logInfo(`Add "${whoAmIHost}" to your hosts file to access example app.`);
      }

      const completeMsg = 'Creation complete. It may take a few minutes for services to become available.';
      logInfo(completeMsg);
      break;
    }
    case 'gcp': {
      // Check if we need to authenticate.
      try {
        const {stdout} = await run('gcloud auth list');
        const isAuthenticated = stdout.indexOf('*') > -1;
        if (!isAuthenticated) {
          await run('gcloud auth login');
        }
      } catch (error) {
        await run('gcloud auth login');
      }

      const {stdout: projectId} = await run('gcloud config get-value project');
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
      logError('No valid cloud provider selected.');
    }
  }
};
