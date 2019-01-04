import { isRemove, logError, run } from './utils';

export default async function secrets(subcommand?: string, key?: string, value?: string) {
  if (!subcommand || subcommand === 'ls') {
    await run('kubectl get secrets');
    return;
  }

  if (subcommand === 'add') {
    if (!key || !value) {
      return logError('Key or value missing. Usage: now secrets add <key> <value>');
    }
    await run(
      `kubectl create secret generic ${key} --from-literal=${key}=${value}`
    );
  }

  if (isRemove(subcommand)) {
    await run(`kubectl delete secret ${key}`);
  }
}
