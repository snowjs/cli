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
var domains_1 = require('./domains');
var utils_1 = require('./utils');
exports['default'] = function(subcommand, aliasOrDeploymentPrefix, hostname) {
  return __awaiter(_this, void 0, void 0, function() {
    function hasExistingRuleFactory(host) {
      return function hasExistingRule(rule) {
        return rule.host === host;
      };
    }
    function hasExistingTLSFactory(host) {
      return function hasExistingTLS(tls) {
        if (!host) {
          return false;
        }
        return tls.hosts.indexOf(host) !== -1;
      };
    }
    var deployment,
      e_1,
      e_2,
      e_3,
      stdout,
      ingressSpec,
      rule,
      ruleIndex,
      tlsIndex,
      ingressPatchString,
      alias,
      stdout,
      ingressSpec,
      ruleIndex,
      tlsIndex,
      ingressPatchString;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          if (!(!subcommand || subcommand === 'ls')) return [3 /*break*/, 2];
          return [
            4 /*yield*/,
            utils_1.run(
              "kubectl get ingress/snow-ingress -o=jsonpath=\"{'Host'} {'<Deployment>'}{'\\n'}{range .spec.rules[*]}{.host} {.http.paths[*].backend.serviceName}{'\\n'}{end}\" | column -t"
            )
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
        case 2:
          if (!(subcommand === 'set')) return [3 /*break*/, 15];
          deployment = aliasOrDeploymentPrefix;
          if (!aliasOrDeploymentPrefix) {
            utils_1.logError(
              'deployment (required): snow alias set <deployment> <alias>'
            );
            return [2 /*return*/];
          }
          if (!hostname) {
            utils_1.logError(
              'alias (required): snow alias set <deployment> <alias>'
            );
            return [2 /*return*/];
          }
          _a.label = 3;
        case 3:
          _a.trys.push([3, 5, , 6]);
          return [4 /*yield*/, domains_1.domainHasCorrectDNSRecords(hostname)];
        case 4:
          _a.sent();
          return [3 /*break*/, 6];
        case 5:
          e_1 = _a.sent();
          return [2 /*return*/];
        case 6:
          _a.trys.push([6, 8, , 9]);
          return [
            4 /*yield*/,
            utils_1.run('kubectl get service/' + deployment)
          ];
        case 7:
          _a.sent();
          return [3 /*break*/, 9];
        case 8:
          e_2 = _a.sent();
          utils_1.logError(
            "No service exists for deployment '" + deployment + "'"
          );
          return [2 /*return*/];
        case 9:
          _a.trys.push([9, 11, , 12]);
          return [
            4 /*yield*/,
            utils_1.run('kubectl get deployment/' + deployment)
          ];
        case 10:
          _a.sent();
          return [3 /*break*/, 12];
        case 11:
          e_3 = _a.sent();
          utils_1.logError("No deployment exists for '" + deployment + "'");
          return [2 /*return*/];
        case 12:
          return [
            4 /*yield*/,
            utils_1.exec('kubectl get ingress/snow-ingress -o json')
          ];
        case 13:
          stdout = _a.sent().stdout;
          ingressSpec = JSON.parse(stdout).spec;
          rule = {
            host: hostname,
            http: {
              paths: [
                {
                  backend: {
                    serviceName: deployment,
                    servicePort: 8080
                  }
                }
              ]
            }
          };
          ruleIndex = ingressSpec.rules.findIndex(
            hasExistingRuleFactory(hostname)
          );
          if (ruleIndex === -1) {
            // No rule exists. Create one.
            ingressSpec.rules.push(rule);
          } else {
            // Update existing rule.
            ingressSpec.rules[ruleIndex] = rule;
          }
          if (!ingressSpec.tls) {
            ingressSpec.tls = [];
          }
          tlsIndex = ingressSpec.tls.findIndex(hasExistingTLSFactory(hostname));
          if (tlsIndex === -1) {
            ingressSpec.tls.push({
              hosts: [hostname],
              secretName: hostname
            });
          }
          ingressPatchString = JSON.stringify({ spec: ingressSpec });
          // Patch the ingress resource.
          return [
            4 /*yield*/,
            utils_1.run(
              "kubectl patch ingress/snow-ingress --patch '" +
                ingressPatchString +
                "'"
            )
          ];
        case 14:
          // Patch the ingress resource.
          _a.sent();
          return [2 /*return*/];
        case 15:
          if (!utils_1.isRemove(subcommand)) return [3 /*break*/, 18];
          alias = aliasOrDeploymentPrefix;
          if (!alias) {
            utils_1.logError('alias (required): snow alias rm <alias>');
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            utils_1.exec('kubectl get ingress/snow-ingress -o json')
          ];
        case 16:
          stdout = _a.sent().stdout;
          ingressSpec = JSON.parse(stdout).spec;
          ruleIndex = ingressSpec.rules.findIndex(
            hasExistingRuleFactory(alias)
          );
          if (ruleIndex !== -1) {
            ingressSpec.rules.splice(ruleIndex, 1);
          }
          tlsIndex = ingressSpec.tls.findIndex(hasExistingTLSFactory(alias));
          /* Only remove the TLS entry if it exists as a certificate with
           * a single hostname (e.g., the certificate has no SANs).
           */
          if (tlsIndex !== -1 && ingressSpec.tls[tlsIndex].hosts.length === 1) {
            ingressSpec.tls.splice(tlsIndex, 1);
          }
          ingressPatchString = JSON.stringify({ spec: ingressSpec });
          // Patch the ingress resource.
          return [
            4 /*yield*/,
            utils_1.run(
              "kubectl patch ingress/snow-ingress --patch '" +
                ingressPatchString +
                "'"
            )
          ];
        case 17:
          // Patch the ingress resource.
          _a.sent();
          return [2 /*return*/];
        case 18:
          utils_1.logError('Invalid usage');
          return [2 /*return*/];
      }
    });
  });
};
//# sourceMappingURL=alias.js.map
