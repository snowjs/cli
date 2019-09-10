import { run } from './utils';

const path = '{.status.loadBalancer.ingress[0].ip}{"\\n"}';
export const cmd = `
  kubectl get services/nginx-ingress-controller \
  --namespace=kube-system \
  -o jsonpath='${path}'`;

export default async () => {
  await run(cmd);
};
