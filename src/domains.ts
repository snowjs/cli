import * as dns from 'dns';
import {promisify} from 'util';
import { cmd } from './ip';
import { exec, logError, logInfo, run } from './utils';

const dnsResolve = promisify(dns.resolve);

export const domainHasCorrectDNSRecords = async (domainName: string) => {
  return new Promise(async (resolve, reject) => {
    let dnsIPs;
    let {stdout: clusterIP} = await exec(cmd);
    clusterIP = clusterIP.trim();
    try {
      dnsIPs = await dnsResolve(domainName, 'A');
    } catch (e) {
      if (e.code === 'ENOTFOUND') {
        logError(`⚠️  Domain name '${domainName}' has no DNS records.`);
        logError(`⚠️  Create an A record for '${domainName}' and set its value to ${clusterIP}.`);
      } else {
        logError('⚠️  Unknown error occurred while verifying DNS records.');
      }
      return;
    }

    dnsIPs.forEach(dnsIP => {
      if (clusterIP.trim() === dnsIP) {
        return;
      }

      logError(`⚠️  Domain name '${domainName}' has an A record for IP address ${dnsIP}, but should be set to ${clusterIP}.`);
      logError(`⚠️  Update DNS records for '${domainName}'.`);
      return reject();
    });

    resolve();
  });
};

interface IngressSpec {
  spec: {
    rules: [{
      host: string;
    }];
    tls: [{
      hosts: string[];
      secretName: string;
    }];
  };
}

function addDomainToIngress(domainName: string, ingressConfig: string): IngressSpec {
  const ingress = JSON.parse(ingressConfig);
  const {spec: {rules = [], tls = []}} = ingress;
  rules.push({host: domainName});
  tls.push({
    hosts: [domainName],
    secretName: domainName
  });
  return {spec: {rules, tls}};
}

export default async (subcommand?: string, domainName?: string) => {
  switch (subcommand) {
    case 'add': {
      if (!domainName) {
        logError('Usage: snow domains add [name]');
        return;
      }

      // Check that domain has proper DNS records.
      // Bail early if they're bad.
      try {
        await domainHasCorrectDNSRecords(domainName);
      } catch (error) {
        return;
      }

      // Check if domain already is already associated with an ingress.
      // Bail early if it is.
      const {stdout} = await exec('kubectl get ingress/snow-ingress -o jsonpath="{range .spec.rules[*]}{@.host}{\'\\n\'}{end}"');
      const domains = stdout.split('\n');
      if (domains.indexOf(domainName) !== -1) {
        logError(`Domain '${domainName}' already configured.`);
        return;
      }

      /* Domain not in ingress. Add it to 'rules' and 'tls'. By default, traffic
       * will go to ingress default backend ("default backend - 404")
       */
      const {stdout: addIngressConfig} = await exec('kubectl get ingress/snow-ingress -o json');
      const {spec: addSpec} = addDomainToIngress(domainName, addIngressConfig);
      await exec(`kubectl patch ingress snow-ingress --patch '${JSON.stringify({spec: addSpec})}'`);

      let hasSSLCert = true;
      try {
        await exec(`kubectl get secrets/${domainName}`);
      } catch (e) {
        hasSSLCert = false;
      }

      logInfo(`✅ Domain '${domainName}' added.`);

      if (!hasSSLCert) {
        logInfo('ℹ️  Wait a minute for SSL Certificate creation.');
      }

      break;
    }
    case undefined:
    case 'ls': {
      const path =
      '{"Domains"}{"\\n\\n"}{range .items[*].spec.rules[*]}{.host}{"\\n"}{end}{"\\n"}';
      await run(`kubectl get ingress -o jsonpath='${path}'`);
      break;
    }
    case 'remove':
    case 'rm':
      if (!domainName) {
        logError('⚠️  No domain name specified.');
        return;
      }

      const {stdout: rmIngressConfig} = await exec('kubectl get ingress/snow-ingress -o json');
      const {spec: {rules = [], tls = []}} = JSON.parse(rmIngressConfig);
      const patch = [
        rules.length && {
          op: 'replace',
          path: '/spec/rules',
          value: rules.filter(({host}: { host: string; }) => (host !== domainName))
        },
        tls.length && {
          op: 'replace',
          path: '/spec/tls',
          value: tls.filter(({secretName}: { secretName: string; }) => (secretName !== domainName))
        }
      ].filter(Boolean);

      // Check if domain already is already associated with an ingress.
      // Bail early if it is.
      const {stdout: domainList} = await exec('kubectl get ingress/snow-ingress -o jsonpath="{range .spec.rules[*]}{@.host}{\'\\n\'}{end}"');
      const currDomains = domainList.split('\n');
      if (currDomains.indexOf(domainName) === -1) {
        logError(`⚠️  Domain '${domainName}' has no existing configuration.`);
        return;
      }

      await exec(`kubectl patch ingress snow-ingress --type='json' --patch '${JSON.stringify(patch)}'`);
      logInfo(`✅  Domain '${domainName}' removed.`);

      break;
    default: {
      console.log('usage error');
    }
  }
};
