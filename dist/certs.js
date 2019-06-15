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
var utils_1 = require('./utils');
function certs(subcommand, commonName) {
  var subAltNames = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    subAltNames[_i - 2] = arguments[_i];
  }
  return __awaiter(this, void 0, void 0, function() {
    var domains;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          if (!(!subcommand || subcommand === 'ls')) return [3 /*break*/, 2];
          return [
            4 /*yield*/,
            utils_1.run(
              'kubectl get certificates -o=custom-columns="Common Name":.metadata.name,SANs:.spec.dnsNames[*],"Created At":.metadata.creationTimestamp'
            )
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
        case 2:
          if (!(subcommand === 'issue')) return [3 /*break*/, 4];
          if (!commonName) {
            utils_1.logError('cn (required): snow certs <cn> [<cn>]');
            return [2 /*return*/];
          }
          domains = __spread([commonName], subAltNames)
            .map(function(domain) {
              return '"' + domain + '"';
            })
            .join();
          return [
            4 /*yield*/,
            utils_1.run(
              '\n    cat <<EOF | kubectl create -f -\n      {\n        "apiVersion": "certmanager.k8s.io/v1alpha1",\n        "kind": "Certificate",\n        "metadata": {\n          "name": "' +
                commonName +
                '",\n          "namespace": "default"\n        },\n        "spec": {\n          "secretName": "' +
                commonName +
                '",\n          "issuerRef": {\n            "kind": "ClusterIssuer",\n            "name": "letsencrypt-prod"\n          },\n          "commonName": "' +
                commonName +
                '",\n          "dnsNames": [' +
                domains +
                '],\n          "acme": {\n            "config": [\n              {\n                "http01": {\n                  "ingressClass": "nginx"\n                },\n                "domains": [' +
                domains +
                ']\n              }\n            ]\n          }\n        }\n      }\n    \nEOF'
            )
          ];
        case 3:
          _a.sent();
          return [2 /*return*/];
        case 4:
          if (!utils_1.isRemove(subcommand)) return [3 /*break*/, 6];
          return [
            4 /*yield*/,
            utils_1.run('kubectl delete certificates/' + commonName)
          ];
        case 5:
          _a.sent();
          _a.label = 6;
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
exports['default'] = certs;
//# sourceMappingURL=certs.js.map
