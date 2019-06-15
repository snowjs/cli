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
var _this = this;
exports.__esModule = true;
var utils_1 = require('./utils');
var providers_1 = require('./providers');
exports['default'] = function() {
  return __awaiter(_this, void 0, void 0, function() {
    var question, provider, _a, projectId, clusterData, _b, location, name, key;
    return __generator(this, function(_c) {
      switch (_c.label) {
        case 0:
          question = 'Which cloud provider do you want to logout of';
          return [
            4 /*yield*/,
            utils_1.pickOne(question, providers_1['default'])
          ];
        case 1:
          provider = _c.sent();
          _a = provider;
          switch (_a) {
            case 'minikube':
              return [3 /*break*/, 2];
            case 'gcp':
              return [3 /*break*/, 3];
          }
          return [3 /*break*/, 9];
        case 2:
          {
            // In the case of minikube, this is a no-op.
            return [3 /*break*/, 10];
          }
          _c.label = 3;
        case 3:
          return [
            4 /*yield*/,
            utils_1.run('gcloud config get-value core/project')
          ];
        case 4:
          projectId = _c.sent().stdout;
          return [
            4 /*yield*/,
            utils_1.run('gcloud container clusters list --format="json"')
          ];
        case 5:
          clusterData = _c.sent().stdout;
          (_b = JSON.parse(clusterData)[0]),
            (location = _b.location),
            (name = _b.name);
          key = 'gke_' + projectId + '_' + location + '_' + name;
          return [
            4 /*yield*/,
            utils_1.run('kubectl config unset clusters.' + key)
          ];
        case 6:
          _c.sent();
          return [
            4 /*yield*/,
            utils_1.run('kubectl config unset contexts.' + key)
          ];
        case 7:
          _c.sent();
          return [
            4 /*yield*/,
            utils_1.run('kubectl config unset users.' + key)
          ];
        case 8:
          _c.sent();
          return [3 /*break*/, 10];
        case 9:
          {
            utils_1.logError('No valid cloud provider selected.');
          }
          _c.label = 10;
        case 10:
          return [2 /*return*/];
      }
    });
  });
};
//# sourceMappingURL=logout.js.map
