import { run } from './utils';

export default async (subcommand?: string) => {
  const isLs = !subcommand || subcommand === 'ls';

  if (!isLs) {
    return;
  }

  const path =
    '{"Domains"}{"\\n\\n"}{range .items[*].spec.rules[*]}{.host}{"\\n"}{end}{"\\n"}';
  await run(`kubectl get ingress -o jsonpath='${path}'`);
};
