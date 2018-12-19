const {run} = require('./utils');

module.exports = async function (args) {
  const [deployment] = args;
  await run(`kubectl delete deploy ${deployment}`);
};
