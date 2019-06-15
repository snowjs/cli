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
var utils_1 = require('./utils');
/*
 * All secrets are stored as individual objects with a single key-value pair (key is string "key").
 * All secrets created via the snow API are labelled with {"snowsecret":"true"}.
 */
function secrets(subcommand, key, valueOrNewKey) {
  return __awaiter(this, void 0, void 0, function() {
    var value, valueBase64, oldKey, newKey, valueBase64, newValue;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          if (!(!subcommand || subcommand === 'ls')) return [3 /*break*/, 2];
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl get secrets -l snowsecret=true -o=custom-columns=Name:.metadata.name,Age:.metadata.creationTimestamp'
            )
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
        case 2:
          if (!(subcommand === 'add')) return [3 /*break*/, 4];
          if (!key || !valueOrNewKey) {
            return [
              2 /*return*/,
              utils_1.logError(
                'Key or value missing. Usage: now secrets add <key> <value>'
              )
            ];
          }
          value = valueOrNewKey;
          valueBase64 = Buffer.from(value).toString('base64');
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    cat <<EOF | kubectl create -f -\n      {\n        "apiVersion": "v1",\n        "kind": "Secret",\n        "metadata": {\n          "name": "' +
                key +
                '",\n          "labels": {\n            "snowsecret": "true"\n          }\n        },\n        "data": {\n          "key": "' +
                valueBase64 +
                '"\n        }\n      }\n    \nEOF'
            )
          ];
        case 3:
          _a.sent();
          _a.label = 4;
        case 4:
          if (!(subcommand === 'rename')) return [3 /*break*/, 8];
          oldKey = key;
          newKey = valueOrNewKey;
          if (!oldKey || !newKey) {
            return [
              2 /*return*/,
              utils_1.logError(
                'Key missing. Usage: now secrets rename <old-key> <new-key>'
              )
            ];
          }
          return [
            4 /*yield*/,
            utils_1.exec(
              'kubectl get secret/' +
                oldKey +
                " --output=jsonpath='{.data.key}'"
            )
          ];
        case 5:
          valueBase64 = _a.sent().stdout;
          newValue = Buffer.from(valueBase64, 'base64').toString();
          // Create secret with name 'newKey'
          return [
            4 /*yield*/,
            utils_1.exec(
              'kubectl create secret generic ' +
                newKey +
                ' --from-literal=key=' +
                newValue
            )
          ];
        case 6:
          // Create secret with name 'newKey'
          _a.sent();
          // Delete secret with name 'oldKey'
          return [4 /*yield*/, utils_1.exec('kubectl delete secret/' + oldKey)];
        case 7:
          // Delete secret with name 'oldKey'
          _a.sent();
          return [2 /*return*/];
        case 8:
          if (!utils_1.isRemove(subcommand)) return [3 /*break*/, 10];
          return [4 /*yield*/, utils_1.run('kubectl delete secret ' + key)];
        case 9:
          _a.sent();
          _a.label = 10;
        case 10:
          return [2 /*return*/];
      }
    });
  });
}
exports['default'] = secrets;
//# sourceMappingURL=secrets.js.map
