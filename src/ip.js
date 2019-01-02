const { run } = require('./utils');

module.exports = async function() {
  const path = '{.status.loadBalancer.ingress[0].ip}{"\\n"}';
  await run(`
    kubectl get services/nginx-ingress-controller \
     --namespace=kube-system \
     -o jsonpath='${path}'
  `);
};
