#!/usr/bin/env node

const chalk = require('chalk');
const mri = require('mri');
const create = require('./create');
const deploy = require('./deploy');
const install = require('./install');
const ls = require('./ls');
const remove = require('./remove');
const secrets = require('./secrets');
const {isRemove} = require('./utils');

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
      console.log(chalk.bold.red(errMsg));
    }
  }
}

main();
