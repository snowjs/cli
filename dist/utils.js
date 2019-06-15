'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
var chalk_1 = require('chalk');
var childProcess = require('child_process');
var fs = require('fs');
var util_1 = require('util');
exports.exec = util_1.promisify(childProcess.exec);
exports.stat = util_1.promisify(fs.stat);
exports.readFile = util_1.promisify(fs.readFile);
function normalizeString(str) {
  return str
    .toString()
    .trim()
    .toLowerCase();
}
function askForInput(msg) {
  return __awaiter(this, void 0, void 0, function() {
    var question;
    return __generator(this, function(_a) {
      question = chalk_1['default'].bold.red('> ' + msg + ': ');
      process.stdout.write(question);
      return [
        2 /*return*/,
        new Promise(function(resolve) {
          function data(d) {
            var input = d.toString().trim();
            process.stdin.removeListener('data', data).pause();
            resolve(input);
          }
          process.stdin.on('data', data).resume();
        })
      ];
    });
  });
}
exports.askForInput = askForInput;
function confirm(msg) {
  return __awaiter(this, void 0, void 0, function() {
    var question, options;
    return __generator(this, function(_a) {
      question = chalk_1['default'].bold.red('> ' + msg + '?');
      options = chalk_1['default'].gray('[y/N] ');
      process.stdout.write(question + ' ' + options + ' ');
      return [
        2 /*return*/,
        new Promise(function(resolve) {
          function data(d) {
            process.stdin.pause();
            var isYes = normalizeString(d) === 'y';
            if (!isYes) {
              console.log(chalk_1['default'].grey('> ') + ' Aborted');
            }
            process.stdin.removeListener('data', data).pause();
            resolve(isYes);
          }
          process.stdin.on('data', data).resume();
        })
      ];
    });
  });
}
exports.confirm = confirm;
function isRemove(str) {
  return str === 'rm' || str === 'remove';
}
exports.isRemove = isRemove;
function logDebug(msg) {
  console.log(chalk_1['default'].gray(msg));
}
exports.logDebug = logDebug;
function logError(msg) {
  console.log(chalk_1['default'].bold.red(msg));
}
exports.logError = logError;
function logInfo(msg) {
  console.log(chalk_1['default'].bold.white(msg));
}
exports.logInfo = logInfo;
function pickOne(msg, options) {
  return __awaiter(this, void 0, void 0, function() {
    var question, prefixes, prefixesStr;
    return __generator(this, function(_a) {
      question = chalk_1['default'].bold.red('> ' + msg + '?');
      prefixes = options.map(function(option) {
        return option.charAt(0);
      });
      prefixesStr = chalk_1['default'].gray('[' + prefixes.join(',') + ']');
      process.stdout.write(
        question + ' (' + options.join(',') + ') ' + prefixesStr + ' '
      );
      return [
        2 /*return*/,
        new Promise(function(resolve) {
          function data(d) {
            var input = normalizeString(d);
            var index = prefixes.indexOf(input);
            var option = options[index];
            process.stdin.removeListener('data', data).pause();
            resolve(option);
          }
          process.stdin.on('data', data).resume();
        })
      ];
    });
  });
}
exports.pickOne = pickOne;
function run(str, opts) {
  return __awaiter(this, void 0, void 0, function() {
    var runString, silent;
    return __generator(this, function(_a) {
      runString = str.replace(/(\s+)/gm, ' ').trim();
      silent = opts ? opts.silent : false;
      if (!silent) {
        logInfo('> ' + runString);
      }
      return [
        2 /*return*/,
        new Promise(function(resolve, reject) {
          function callback(error, stdout, stderr) {
            if (error) {
              if (!silent) {
                process.stderr.write(chalk_1['default'].red(error.message));
                if (error.stack) {
                  process.stderr.write(chalk_1['default'].white(error.stack));
                }
              }
              return reject(error);
            }
            return resolve({
              stdout: stdout.toString().trim(),
              stderr: stderr.toString().trim()
            });
          }
          var cmd = childProcess.exec(str, opts, callback);
          if (silent) {
            return;
          }
          cmd.stderr.on('data', function(data) {
            process.stdout.write(chalk_1['default'].gray(data));
          });
          cmd.stdout.on('data', function(data) {
            process.stdout.write(chalk_1['default'].gray(data));
          });
        })
      ];
    });
  });
}
exports.run = run;
//# sourceMappingURL=utils.js.map
