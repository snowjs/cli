import cloudProviders from './providers';
import { logError, pickOne, run } from './utils';

export default async () => {
  const question = 'Which cloud provider do you want to login to';
  const provider = await pickOne(question, cloudProviders);

  switch (provider) {
    case 'minikube': {
      await run('kubectl config use-context minikube');
      break;
    }
    case 'gcp': {
      await run('gcloud auth login');

      // Setup default project
      const {stdout: projectsStr} = await run('gcloud projects list --format json');
      const projects = JSON.parse(projectsStr);

      if (projects.length === 0) {
        logError('No projects exist. Create a project.');
        return;
      }

      const {projectId} = projects[0];
      await run(`gcloud config set project ${projectId}`);

      // Get cluster credentials
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
