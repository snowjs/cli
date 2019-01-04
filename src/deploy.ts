import * as path from 'path';
import chalk from 'chalk';
import {exec, readFile, stat} from './utils';

export default async function() {
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
  const { name } = nowConfig;
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
    const { stdout } = await exec(
      'docker ps --format "{{.Names}}" -f "name=registry"'
    );
    if (!stdout) {
      registryRunning = false;
    }
  } catch (error) {
    console.log(`Could not determine if registry started.\n${error.message}`);
    return;
  }
  if (!registryRunning) {
    try {
      await exec(
        'docker run -d -p 5000:5000 --restart=always --name registry registry:2'
      );
    } catch (error) {
      console.log(`Could not start local Docker registry.\n${error.message}`);
    }
  }

  // Fifth: Push image to local registry.

  // Sixth: Create or update a deployment.

  // Seventh: Create or update a service.

  // Eight: Create or update the ingress resource.
};
