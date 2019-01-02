const childProcess = require('child_process');
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');

const exec = util.promisify(childProcess.exec);
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);

function askForInput(msg) {
  const question = chalk.bold.red(`> ${msg}: `);
  process.stdout.write(question);
  return new Promise(resolve => {
    function data(d) {
      const input = d.toString().trim();
      process.stdin.removeListener('data', data).pause();
      resolve(input);
    }
    process.stdin.on('data', data).resume();
  });
}

function confirm(msg) {
  const question = chalk.bold.red(`> ${msg}?`);
  const options = chalk.gray('[y/N] ');
  process.stdout.write(`${question} ${options} `);
  return new Promise(resolve => {
    function data(d) {
      process.stdin.pause();
      const isYes = d.toString().trim().toLowerCase() === 'y';
      if (!isYes) {
        console.log(`${chalk.grey('> ')} Aborted`);
      }
      process.stdin.removeListener('data', data).pause();
      resolve(isYes);
    }
    process.stdin.on('data', data).resume();
  });
}

function isRemove(str) {
  return str === 'rm' || str === 'remove';
}

function logDebug(message) {
  console.log(chalk.gray(message));
}

function logError(message) {
  console.log(chalk.bold.red(message));
}

function logInfo(message) {
  console.log(chalk.bold.white(message));
}

function pickOne(msg, options) {
  const question = chalk.bold.red(`> ${msg}?`);
  const prefixes = options.map(option => option.charAt(0));
  const prefixesStr = chalk.gray(`[${prefixes.join(',')}]`);
  process.stdout.write(`${question} (${options.join(',')}) ${prefixesStr} `);
  return new Promise(resolve => {
    function data(d) {
      const input = d.toString().trim().toLowerCase();
      const index = prefixes.indexOf(input);
      const option = options[index];
      process.stdin.removeListener('data', data).pause();
      resolve(option);
    }
    process.stdin.on('data', data).resume();
  });
}

function run(str, opts) {
  const runString = str.replace(/(\s+)/gm, ' ').trim();
  logInfo(`> ${runString}`);
  return new Promise((resolve, reject) => {
    function callback(error, stdout, stderr) {
      if (error) {
        process.stderr.write(chalk.red(error));
        return reject(error);
      }
      return resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    }
    const cmd = childProcess.exec(str, opts, callback);
    cmd.stderr.on('data', data => {
      process.stdout.write(chalk.gray(data));
    });
    cmd.stdout.on('data', data => {
      process.stdout.write(chalk.gray(data));
    });
  });
}

module.exports = {
  askForInput,
  confirm,
  exec,
  isRemove,
  logDebug,
  logError,
  logInfo,
  pickOne,
  readFile,
  run,
  stat
};
