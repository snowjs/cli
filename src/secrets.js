const { isRemove, run } = require('./utils');

module.exports = async function(args) {
  const [action, key, value] = args;
  if (action === 'ls') {
    await run('kubectl get secrets');
  }
  if (action === 'add') {
    await run(
      `kubectl create secret generic ${key} --from-literal=${key}=${value}`
    );
  }
  if (isRemove(action)) {
    await run(`kubectl delete secret ${key}`);
  }
};
