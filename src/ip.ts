import { run } from './utils';

export default async function() {
  const path = '{.status.loadBalancer.ingress[0].ip}{"\\n"}';
  await run(`
    kubectl get services/nginx-ingress-controller \
     --namespace=kube-system \
     -o jsonpath='${path}'
  `);
};
