#!/usr/bin/env node
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
var __read =
  (this && this.__read) ||
  function(o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
var __spread =
  (this && this.__spread) ||
  function() {
    for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
    return ar;
  };
exports.__esModule = true;
var sourcemapsupport = require('source-map-support');
sourcemapsupport.install();
var mri = require('mri');
var alias_1 = require('./alias');
var certs_1 = require('./certs');
var create_1 = require('./create');
var deploy_1 = require('./deploy');
var domains_1 = require('./domains');
var install_1 = require('./install');
var ip_1 = require('./ip');
var login_1 = require('./login');
var logout_1 = require('./logout');
var ls_1 = require('./ls');
var remove_1 = require('./remove');
var scale_1 = require('./scale');
var secrets_1 = require('./secrets');
var utils_1 = require('./utils');
function main() {
  return __awaiter(this, void 0, void 0, function() {
    var _, _a, command, rest, _b, errMsg;
    return __generator(this, function(_c) {
      switch (_c.label) {
        case 0:
          _ = mri(process.argv.slice(2))._;
          (_a = __read(_)), (command = _a[0]), (rest = _a.slice(1));
          _b = command;
          switch (_b) {
            case 'alias':
              return [3 /*break*/, 1];
            case 'certs':
              return [3 /*break*/, 3];
            case 'create':
              return [3 /*break*/, 5];
            case undefined:
              return [3 /*break*/, 7];
            case 'deploy':
              return [3 /*break*/, 7];
            case 'domains':
              return [3 /*break*/, 9];
            case 'install':
              return [3 /*break*/, 11];
            case 'ip':
              return [3 /*break*/, 13];
            case 'login':
              return [3 /*break*/, 15];
            case 'logout':
              return [3 /*break*/, 17];
            case 'ls':
              return [3 /*break*/, 19];
            case 'remove':
              return [3 /*break*/, 21];
            case 'rm':
              return [3 /*break*/, 21];
            case 'scale':
              return [3 /*break*/, 23];
            case 'secrets':
              return [3 /*break*/, 25];
          }
          return [3 /*break*/, 27];
        case 1:
          return [4 /*yield*/, alias_1['default'](rest[0], rest[1], rest[2])];
        case 2:
          _c.sent();
          return [3 /*break*/, 28];
        case 3:
          return [
            4 /*yield*/,
            certs_1['default'].apply(void 0, __spread(rest))
          ];
        case 4:
          _c.sent();
          return [3 /*break*/, 28];
        case 5:
          return [4 /*yield*/, create_1['default']()];
        case 6:
          _c.sent();
          return [3 /*break*/, 28];
        case 7:
          return [4 /*yield*/, deploy_1['default']()];
        case 8:
          _c.sent();
          return [3 /*break*/, 28];
        case 9:
          return [
            4 /*yield*/,
            domains_1['default'].apply(void 0, __spread(rest))
          ];
        case 10:
          _c.sent();
          return [3 /*break*/, 28];
        case 11:
          return [4 /*yield*/, install_1['default']()];
        case 12:
          _c.sent();
          return [3 /*break*/, 28];
        case 13:
          return [4 /*yield*/, ip_1['default']()];
        case 14:
          _c.sent();
          return [3 /*break*/, 28];
        case 15:
          return [4 /*yield*/, login_1['default']()];
        case 16:
          _c.sent();
          return [3 /*break*/, 28];
        case 17:
          return [4 /*yield*/, logout_1['default']()];
        case 18:
          _c.sent();
          return [3 /*break*/, 28];
        case 19:
          return [4 /*yield*/, ls_1['default']()];
        case 20:
          _c.sent();
          return [3 /*break*/, 28];
        case 21:
          return [4 /*yield*/, remove_1['default'](rest[0])];
        case 22:
          _c.sent();
          return [3 /*break*/, 28];
        case 23:
          return [4 /*yield*/, scale_1['default'](rest[0], rest[1], rest[2])];
        case 24:
          _c.sent();
          return [3 /*break*/, 28];
        case 25:
          return [
            4 /*yield*/,
            secrets_1['default'].apply(void 0, __spread(rest))
          ];
        case 26:
          _c.sent();
          return [3 /*break*/, 28];
        case 27:
          {
            errMsg =
              'Error: Invalid command: snow ' + command + ' ' + rest.join(' ');
            utils_1.logError(errMsg);
          }
          _c.label = 28;
        case 28:
          return [2 /*return*/];
      }
    });
  });
}
// tslint:disable-next-line:no-floating-promises
main();
//# sourceMappingURL=index.js.map
