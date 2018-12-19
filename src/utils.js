const childProcess = require('child_process');
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');

const exec = util.promisify(childProcess.exec);
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);

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

function pickOne(msg, options) {
  const prefixes = options.map(option => option.charAt(0));
  const question = chalk.bold.red(`> ${msg}?`);
  const optsStr = chalk.gray(`[${prefixes.join(',')}]`);
  process.stdout.write(`${question} ${optsStr} `);
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

function run(str) {
  console.log(chalk.white(`> ${str}`));
  return new Promise(resolve => {
    function callback(error, ...rest) {
      if (error) {
        process.stderr.write(chalk.red(error));
      }
      return resolve(rest);
    }
    const cmd = childProcess.exec(str, callback);
    cmd.stderr.on('data', data => {
      process.stdout.write(chalk.gray(data));
    });
    cmd.stdout.on('data', data => {
      process.stdout.write(chalk.gray(data));
    });
  });
}

module.exports = {
  confirm,
  exec,
  isRemove,
  pickOne,
  readFile,
  run,
  stat
};
