import { logError, pickOne, run } from './utils';

export default async function() {
  const question = 'Which cloud provider do you want to logout of';
  const options = ['minikube', 'gcp'];
  const provider = await pickOne(question, options);
  switch (provider) {
    case 'minikube': {
      // In the case of minikube, this is a no-op.
      break;
    }
    case 'gcp': {
      const { stdout: projectId } = await run(
        'gcloud config get-value core/project'
      );
      const { stdout: clusterData } = await run(
        'gcloud container clusters list --format="json"'
      );
      const { location, name } = JSON.parse(clusterData)[0];
      const key = `gke_${projectId}_${location}_${name}`;
      await run(`kubectl config unset clusters.${key}`);
      await run(`kubectl config unset contexts.${key}`);
      await run(`kubectl config unset users.${key}`);
      break;
    }
    default: {
      logError('No valid cloud provider selected.');
    }
  }
};
