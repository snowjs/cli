import { logError, run } from './utils';

export default async function(deployment?: string) {
  if (!deployment) {
    return logError('No deployment specified.');
  }
  await run(`kubectl delete deploy ${deployment}`);
};
