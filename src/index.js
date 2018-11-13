#!/usr/bin/env node

const childProcess = require('child_process');
const util = require('util');
const chalk = require('chalk');
const mri = require('mri');

const exec = util.promisify(childProcess.exec);

async function run(str) {
  try {
    const {stdout} = await exec(str);
    console.log(stdout);
  } catch (error) {
    console.log(chalk.red(error.stderr));
  }
}

function isRemove(str) {
  return str === 'rm' || str === 'remove';
}

async function main() {
  const {_} = mri(process.argv.slice(2));
  const [command, ...rest] = _;

  if (command === 'ls') {
    const [deployment] = rest;
    await run(`kubectl get deployments ${deployment}`);
  }
  if (isRemove(command)) {
    const [deployment] = rest;
    await run(`kubectl delete deploy ${deployment}`);
  }
  if (command === 'secrets') {
    const [action, key, value] = rest;
    if (action === 'ls') {
      await run('kubectl get secrets');
    }
    if (action === 'add') {
      await run(`kubectl create secret generic ${key} --from-literal=${key}=${value}`);
    }
    if (isRemove(action)) {
      await run(`kubectl delete secret ${key}`);
    }
  }
}

main();
