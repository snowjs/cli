import { logError, pickOne, run } from './utils';

export default async function() {
  const cloudProviders: string[] = ['minikube', 'gcp'];
  const question: string = 'Which cloud provider do you want to login to?';
  const provider: string = await pickOne(question, cloudProviders);
  switch (provider) {
    case 'minikube': {
      await run('kubectl config use-context minikube');
      break;
    }
    case 'gcp': {
      await run('gcloud auth login');
      const { stdout: clusterData }: {stdout: string} = await run(
        'gcloud container clusters list --format="json"'
      );
      const { location, name }: {location: string, name: string} = JSON.parse(clusterData)[0];
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
