import { exec, isRemove, logError, run } from './utils';

/*
 * All secrets are stored as individual objects with a single key-value pair (key is string "key").
 * All secrets created via the snow API are labelled with {"snowsecret":"true"}.
 */
export default async function secrets(subcommand?: string, key?: string, valueOrNewKey?: string) {
  if (!subcommand || subcommand === 'ls') {
    await run('kubectl get secrets -l snowsecret=true -o=custom-columns=Name:.metadata.name,Age:.metadata.creationTimestamp');
    return;
  }

  if (subcommand === 'add') {
    if (!key || !valueOrNewKey) {
      return logError('Key or value missing. Usage: now secrets add <key> <value>');
    }
    const value = valueOrNewKey;
    const valueBase64 = Buffer.from(value).toString('base64');
    await run(`
    cat <<EOF | kubectl create -f -
      {
        "apiVersion": "v1",
        "kind": "Secret",
        "metadata": {
          "name": "${key}",
          "labels": {
            "snowsecret": "true"
          }
        },
        "data": {
          "key": "${valueBase64}"
        }
      }
    \nEOF`);
  }

  if (subcommand === 'rename') {
    /* In kubernetes, you can't rename a resource. You can, however, create an identical resource with 
     * a new name, and then delete the old resource.
     */
    const oldKey = key;
    const newKey = valueOrNewKey;

    if (!oldKey || !newKey) {
      return logError('Key missing. Usage: now secrets rename <old-key> <new-key>');
    }

    const {stdout: valueBase64} = await exec(`kubectl get secret/${oldKey} --output=jsonpath=\'{.data.key}\'`);
    const newValue = Buffer.from(valueBase64, 'base64').toString();

    // Create secret with name 'newKey'
    await exec(`kubectl create secret generic ${newKey} --from-literal=key=${newValue}`);

    // Delete secret with name 'oldKey'
    await exec(`kubectl delete secret/${oldKey}`);
    return;
  }

  if (isRemove(subcommand)) {
    await run(`kubectl delete secret ${key}`);
  }
}
