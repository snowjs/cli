#!/usr/bin/env node

const mri = require('mri');
const create = require('./create');
const deploy = require('./deploy');
const install = require('./install');
const login = require('./login');
const logout = require('./logout');
const ls = require('./ls');
const remove = require('./remove');
const secrets = require('./secrets');
const {isRemove, logError} = require('./utils');

async function main() {
  const {_} = mri(process.argv.slice(2));
  const [command, ...rest] = _;

  switch (command) {
    case 'create': {
      await create(rest);
      break;
    }
    case undefined:
    case 'deploy': {
      await deploy(rest);
      break;
    }
    case 'install': {
      await install(rest);
      break;
    }
    case 'login':
      await login(rest);
      break;
    case 'logout':
      await logout(rest);
      break;
    case 'ls': {
      await ls(rest);
      break;
    }
    case isRemove(command): {
      await remove(rest);
      break;
    }
    case 'secrets': {
      await secrets(rest);
      break;
    }
    default: {
      const errMsg = `Error: Invalid command: snow ${command} ${rest.join(' ')}`;
      logError(errMsg);
    }
  }
}

main();
