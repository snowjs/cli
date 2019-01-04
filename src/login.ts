import { logError, pickOne, run } from './utils';

export default async () => {
  const cloudProviders = ['minikube', 'gcp'];
  const question = 'Which cloud provider do you want to login to';
  const provider = await pickOne(question, cloudProviders);
  switch (provider) {
    case 'minikube': {
      await run('kubectl config use-context minikube');
      break;
    }
    case 'gcp': {
      await run('gcloud auth login');
      const { stdout: clusterData } = await run(
        'gcloud container clusters list --format="json"'
      );
      const { location, name } = JSON.parse(clusterData)[0];
      await run(
        `gcloud container clusters get-credentials ${name} --zone "${location}"`
      );
      break;
    }
    default: {
      logError('No valid cloud provider selected.');
    }
  }
};
