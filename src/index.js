#!/usr/bin/env node

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const chalk = require('chalk');
const mri = require('mri');

const exec = util.promisify(childProcess.exec);
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);

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

  if (_.length === 0 || command === 'deploy') {
    // First: Verify we have a Dockerfile.
    const dockerFilePath = path.resolve(process.cwd(), 'Dockerfile');
    try {
      await stat(dockerFilePath);
    } catch (error) {
      const msg = `Error finding Dockerfile.\n${error.message}`;
      console.log(chalk.red(msg));
      return;
    }

    // Second: Verify we have a now.json file.
    const nowFilePath = path.resolve(process.cwd(), 'now.json');
    let nowConfig;
    try {
      const nowFile = await readFile(nowFilePath);
      nowConfig = JSON.parse(nowFile.toString());
    } catch (error) {
      console.log(chalk.red(`Error reading now.json.\n${error.message}`));
      return;
    }

    // Third: Build and tag the image.
    const {name} = nowConfig;
    if (!name) {
      console.log(chalk.red('Specify a "name" in now.json'));
      return;
    }
    const imageName = `${name}:latest`;
    try {
      await exec(`docker build -t ${imageName} -f ./Dockerfile .`);
      console.log(`Docker image built => ${imageName}`);
    } catch (error) {
      console.log(`Could not build image from Dockerfile.\n${error.message}`);
    }

    // Fourth: Start a local Docker registry, if necessary.
    let registryRunning = true;
    try {
      const {stdout} = await exec('docker ps --format "{{.Names}}" -f "name=registry"');
      if (!stdout) {
        registryRunning = false;
      }
    } catch (error) {
      console.log(`Could not determine if registry started.\n${error.message}`);
      return;
    }
    if (!registryRunning) {
      try {
        await exec('docker run -d -p 5000:5000 --restart=always --name registry registry:2');
      } catch (error) {
        console.log(`Could not start local Docker registry.\n${error.message}`);
        return;
      }
    }

    // Fifth: Push image to local registry.
  }
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
