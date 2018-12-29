const {run} = require('./utils');

module.exports = async function (args) {
  const [deployment] = args;
  if (!deployment) {
    return run('kubectl get deployments');
  }
  await run(`kubectl get deployments ${deployment}`);
};
