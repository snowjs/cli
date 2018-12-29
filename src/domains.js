const {run} = require('./utils');

module.exports = async function (args) {
  const [subcommand] = args;

  if (!subcommand || subcommand === 'ls') {
    const path = '{"Domains"}{"\\n\\n"}{range .items[*].spec.rules[*]}{.host}{"\\n"}{end}{"\\n"}';
    await run(`kubectl get ingress -o jsonpath='${path}'`);
  }
};
