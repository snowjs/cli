import {domainHasCorrectDNSRecords} from './domains';
import { exec, isRemove, logError, run } from './utils';

export default async (subcommand?: string, aliasOrDeploymentPrefix?: string, hostname?: string) => {
  interface IRule {
    host: string;
  }

  interface ITLS {
    hosts: string[];
  }

  function hasExistingRuleFactory(host?: string) {
    return function hasExistingRule(rule: IRule) {
      return rule.host === host;
    };
  }

  function hasExistingTLSFactory(host?: string) {
    return function hasExistingTLS(tls: ITLS) {
      if (!host) {
        return false;
      }
      return tls.hosts.indexOf(host) !== -1;
    };
  }

  if (!subcommand || subcommand === 'ls') {
    await run('kubectl get ingress/snow-ingress -o=jsonpath=\"{\'Host\'} {\'<Deployment>\'}{\'\\n\'}{range .spec.rules[*]}{.host} {.http.paths[*].backend.serviceName}{\'\\n\'}{end}\" | column -t');
    return;
  }

  if (subcommand === 'set') {
    const deployment = aliasOrDeploymentPrefix;

    if (!aliasOrDeploymentPrefix) {
      logError('deployment (required): snow alias set <deployment> <alias>');
      return;
    }

    if (!hostname) {
      logError('alias (required): snow alias set <deployment> <alias>');
      return;
    }

    // Verify the domain name has the correct DNS records.
    try {
      await domainHasCorrectDNSRecords(hostname);
    } catch (e) {
      return;
    }

    // Given a deployment name, verify both a deployment and service exist.
    try {
      await run(`kubectl get service/${deployment}-service`);
    } catch (e) {
      logError(`No service exists for deployment '${deployment}'`);
      return;
    }

    try {
      await run(`kubectl get deployment/${deployment}-deployment`);
    } catch (e) {
      logError(`No deployment exists for '${deployment}'`);
      return;
    }

    // Fetch the ingress spec.
    const { stdout } = await exec('kubectl get ingress/snow-ingress -o json');
    const ingressSpec = JSON.parse(stdout).spec;

    const rule = {
      host: hostname,
      http: {
        paths: [
          {
            backend: {
              serviceName: `${deployment}-service`,
              servicePort: 80
            }
          }
        ]
      }
    };

    // See if an existing rule exists.
    const ruleIndex = ingressSpec.rules.findIndex(hasExistingRuleFactory(hostname));

    if (ruleIndex === -1) {
      // No rule exists. Create one.
      ingressSpec.rules.push(rule);
    } else {
      // Update existing rule.
      ingressSpec.rules[ruleIndex] = rule;
    }

    // See if an existing TLS entry exists.
    const tlsIndex = ingressSpec.tls.findIndex(hasExistingTLSFactory(hostname));
    if (tlsIndex === -1) {
      ingressSpec.tls.push({
        hosts: [hostname],
        secretName: hostname
      });
    }

    const ingressPatchString = JSON.stringify({spec: ingressSpec});

    // Patch the ingress resource.
    await run(`kubectl patch ingress/snow-ingress --patch '${ingressPatchString}'`);

    return;
  }

  if (isRemove(subcommand)) {
    const alias = aliasOrDeploymentPrefix;

    if (!alias) {
      logError('alias (required): snow alias rm <alias>');
      return;
    }

    // Fetch the ingress spec.
    const { stdout } = await exec('kubectl get ingress/snow-ingress -o json');
    const ingressSpec = JSON.parse(stdout).spec;

    // See if an existing rule exists.
    const ruleIndex = ingressSpec.rules.findIndex(hasExistingRuleFactory(alias));

    if (ruleIndex !== -1) {
      ingressSpec.rules.splice(ruleIndex, 1);
    }

    // See if an existing TLS entry exists.
    const tlsIndex = ingressSpec.tls.findIndex(hasExistingTLSFactory(alias));

    /* Only remove the TLS entry if it exists as a certificate with
     * a single hostname (e.g., the certificate has no SANs).
     */
    if (tlsIndex !== -1 && ingressSpec.tls[tlsIndex].hosts.length === 1) {
      ingressSpec.tls.splice(tlsIndex, 1);
    }

    const ingressPatchString = JSON.stringify({spec: ingressSpec});

    // Patch the ingress resource.
    await run(`kubectl patch ingress/snow-ingress --patch '${ingressPatchString}'`);

    return;
  }

  logError('Invalid usage');
};
