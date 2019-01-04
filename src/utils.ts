import chalk from 'chalk';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import {promisify} from 'util';

export const exec = promisify(childProcess.exec);
export const stat = promisify(fs.stat);
export const readFile = promisify(fs.readFile);

function normalizeString(str: string) {
  return str
    .toString()
    .trim()
    .toLowerCase();
}

export async function askForInput(msg: string) {
  const question = chalk.bold.red(`> ${msg}: `);
  process.stdout.write(question);

  return new Promise(resolve => {
    function data(d: any) {
      const input = d.toString().trim();
      process.stdin.removeListener('data', data).pause();
      resolve(input);
    }

    process.stdin.on('data', data).resume();
  });
}

export async function confirm(msg: string) {
  const question = chalk.bold.red(`> ${msg}?`);
  const options = chalk.gray('[y/N] ');

  process.stdout.write(`${question} ${options} `);

  return new Promise(resolve => {
    function data(d: any) {
      process.stdin.pause();
      const isYes = normalizeString(d) === 'y';

      if (!isYes) {
        console.log(`${chalk.grey('> ')} Aborted`);
      }

      process.stdin.removeListener('data', data).pause();
      resolve(isYes);
    }

    process.stdin.on('data', data).resume();
  });
}

export function isRemove(str: string | undefined) {
  return str === 'rm' || str === 'remove';
}

export function logDebug(msg: string) {
  console.log(chalk.gray(msg));
}

export function logError(msg: string) {
  console.log(chalk.bold.red(msg));
}

export function logInfo(msg: string) {
  console.log(chalk.bold.white(msg));
}

export async function pickOne(msg: string, options: string[]) : Promise<string> {
  const question = chalk.bold.red(`> ${msg}?`);
  const prefixes = options.map(option => option.charAt(0));
  const prefixesStr = chalk.gray(`[${prefixes.join(',')}]`);

  process.stdout.write(`${question} (${options.join(',')}) ${prefixesStr} `);

  return new Promise(resolve => {
    function data(d: any) {
      const input = normalizeString(d);
      const index = prefixes.indexOf(input);
      const option = options[index];

      process.stdin.removeListener('data', data).pause();

      resolve(option);
    }

    process.stdin.on('data', data).resume();
  });
}

type IRunResolve = {
  stdout: string,
  stderr: string
};

export async function run(
  str: string,
  opts?: childProcess.ExecOptions
) : Promise<IRunResolve> {
  const runString = str.replace(/(\s+)/gm, ' ').trim();

  logInfo(`> ${runString}`);

  return new Promise((resolve, reject) => {
    function callback(
      error: childProcess.ExecException | null,
      stdout: string | Buffer,
      stderr: string | Buffer
    ) {
      if (error) {
        process.stderr.write(chalk.red(error.message));

        if (error.stack) {
          process.stderr.write(chalk.white(error.stack));
        }

        return reject(error);
      }

      return resolve({
        stdout: stdout.toString().trim(),
        stderr: stderr.toString().trim()
      });
    }

    const cmd = childProcess.exec(str, opts, callback);

    cmd.stderr.on('data', (data: string) => {
      process.stdout.write(chalk.gray(data));
    });

    cmd.stdout.on('data', (data: string) => {
      process.stdout.write(chalk.gray(data));
    });
  });
}
