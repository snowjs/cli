#!/usr/bin/env node

import * as sourcemapsupport from 'source-map-support';
sourcemapsupport.install();

import * as mri from 'mri';
import alias from './alias';
import certs from './certs';
import create from './create';
import deploy from './deploy';
import domains from './domains';
import install from './install';
import ip from './ip';
import login from './login';
import logout from './logout';
import ls from './ls';
import remove from './remove';
import scale from './scale';
import secrets from './secrets';
import { logError } from './utils';

async function main() {
  const { _ } = mri(process.argv.slice(2));
  const [command, ...rest] = _;

  switch (command) {
    case 'alias': {
      await alias(rest[0], rest[1], rest[2]);
      break;
    }
    case 'certs': {
      await certs(...rest);
      break;
    }
    case 'create': {
      await create();
      break;
    }
    case undefined:
    case 'deploy': {
      await deploy();
      break;
    }
    case 'domains': {
      await domains(...rest);
      break;
    }
    case 'install': {
      await install();
      break;
    }
    case 'ip': {
      await ip();
      break;
    }
    case 'login':
      await login();
      break;
    case 'logout':
      await logout();
      break;
    case 'ls': {
      await ls();
      break;
    }
    case 'remove':
    case 'rm': {
      await remove(rest[0]);
      break;
    }
    case 'scale': {
      await scale(rest[0], rest[1], rest[2]);
      break;
    }
    case 'secrets': {
      await secrets(...rest);
      break;
    }
    default: {
      const errMsg = `Error: Invalid command: snow ${command} ${rest.join(
        ' '
      )}`;
      logError(errMsg);
    }
  }
}

// tslint:disable-next-line:no-floating-promises
main();
