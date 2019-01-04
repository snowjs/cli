import { run } from './utils';

export default async function(deployment?: string) {
  if (!deployment) {
    return run('kubectl get deployments');
  }
  await run(`kubectl get deployments ${deployment}`);
};
