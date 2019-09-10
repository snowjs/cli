import { isRemove, logError, run } from './utils';

export default async function certs(subcommand?: string, commonName?: string, ...subAltNames: string[]) {
  if (!subcommand || subcommand === 'ls') {
    await run('kubectl get certificates -o=custom-columns="Common Name":.metadata.name,SANs:.spec.dnsNames[*],"Created At":.metadata.creationTimestamp');
    return;
  }

  if (subcommand === 'issue') {
    if (!commonName) {
      logError('cn (required): snow certs <cn> [<cn>]');
      return;
    }
    const domains = [commonName, ...subAltNames].map(domain => `"${domain}"`).join();
    await run(`
    cat <<EOF | kubectl create -f -
      {
        "apiVersion": "certmanager.k8s.io/v1alpha1",
        "kind": "Certificate",
        "metadata": {
          "name": "${commonName}",
          "namespace": "default"
        },
        "spec": {
          "secretName": "${commonName}",
          "issuerRef": {
            "kind": "ClusterIssuer",
            "name": "letsencrypt-prod"
          },
          "commonName": "${commonName}",
          "dnsNames": [${domains}],
          "acme": {
            "config": [
              {
                "http01": {
                  "ingressClass": "nginx"
                },
                "domains": [${domains}]
              }
            ]
          }
        }
      }
    \nEOF`);
    return;
  }

  if (isRemove(subcommand)) {
    await run(`kubectl delete certificates/${commonName}`);
  }
}
