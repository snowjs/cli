const { run } = require('./utils');

export default async function(subcommand?: string) {
  if (!subcommand || subcommand === 'ls') {
    const path =
      '{"Domains"}{"\\n\\n"}{range .items[*].spec.rules[*]}{.host}{"\\n"}{end}{"\\n"}';
    await run(`kubectl get ingress -o jsonpath='${path}'`);
  }
};
