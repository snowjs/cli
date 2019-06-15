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
var dns = require('dns');
var util_1 = require('util');
var ip_1 = require('./ip');
var utils_1 = require('./utils');
var dnsResolve = util_1.promisify(dns.resolve);
exports.domainHasCorrectDNSRecords = function(domainName) {
  return __awaiter(_this, void 0, void 0, function() {
    var _this = this;
    return __generator(this, function(_a) {
      return [
        2 /*return*/,
        new Promise(function(resolve, reject) {
          return __awaiter(_this, void 0, void 0, function() {
            var dnsIPs, clusterIP, e_1;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4 /*yield*/, utils_1.exec(ip_1.cmd)];
                case 1:
                  clusterIP = _a.sent().stdout;
                  clusterIP = clusterIP.trim();
                  _a.label = 2;
                case 2:
                  _a.trys.push([2, 4, , 5]);
                  return [4 /*yield*/, dnsResolve(domainName, 'A')];
                case 3:
                  dnsIPs = _a.sent();
                  return [3 /*break*/, 5];
                case 4:
                  e_1 = _a.sent();
                  if (e_1.code === 'ENOTFOUND') {
                    utils_1.logError(
                      "\u26A0\uFE0F  Domain name '" +
                        domainName +
                        "' has no DNS records."
                    );
                    utils_1.logError(
                      "\u26A0\uFE0F  Create an A record for '" +
                        domainName +
                        "' and set its value to " +
                        clusterIP +
                        '.'
                    );
                  } else {
                    utils_1.logError(
                      '⚠️  Unknown error occurred while verifying DNS records.'
                    );
                  }
                  return [2 /*return*/];
                case 5:
                  dnsIPs.forEach(function(dnsIP) {
                    if (clusterIP.trim() === dnsIP) {
                      return;
                    }
                    utils_1.logError(
                      "\u26A0\uFE0F  Domain name '" +
                        domainName +
                        "' has an A record for IP address " +
                        dnsIP +
                        ', but should be set to ' +
                        clusterIP +
                        '.'
                    );
                    utils_1.logError(
                      "\u26A0\uFE0F  Update DNS records for '" +
                        domainName +
                        "'."
                    );
                    return reject();
                  });
                  resolve();
                  return [2 /*return*/];
              }
            });
          });
        })
      ];
    });
  });
};
function addDomainToIngress(domainName, ingressConfig) {
  var ingress = JSON.parse(ingressConfig);
  var _a = ingress.spec,
    _b = _a.rules,
    rules = _b === void 0 ? [] : _b,
    _c = _a.tls,
    tls = _c === void 0 ? [] : _c;
  rules.push({ host: domainName });
  tls.push({
    hosts: [domainName],
    secretName: domainName
  });
  return { spec: { rules: rules, tls: tls } };
}
exports['default'] = function(subcommand, domainName) {
  return __awaiter(_this, void 0, void 0, function() {
    var _a,
      error_1,
      stdout,
      domains,
      addIngressConfig,
      addSpec,
      hasSSLCert,
      e_2,
      path,
      rmIngressConfig,
      _b,
      _c,
      rules,
      _d,
      tls,
      patch,
      domainList,
      currDomains;
    return __generator(this, function(_e) {
      switch (_e.label) {
        case 0:
          _a = subcommand;
          switch (_a) {
            case 'add':
              return [3 /*break*/, 1];
            case undefined:
              return [3 /*break*/, 13];
            case 'ls':
              return [3 /*break*/, 13];
            case 'remove':
              return [3 /*break*/, 15];
            case 'rm':
              return [3 /*break*/, 15];
          }
          return [3 /*break*/, 19];
        case 1:
          if (!domainName) {
            utils_1.logError('Usage: snow domains add [name]');
            return [2 /*return*/];
          }
          _e.label = 2;
        case 2:
          _e.trys.push([2, 4, , 5]);
          return [4 /*yield*/, exports.domainHasCorrectDNSRecords(domainName)];
        case 3:
          _e.sent();
          return [3 /*break*/, 5];
        case 4:
          error_1 = _e.sent();
          return [2 /*return*/];
        case 5:
          return [
            4 /*yield*/,
            utils_1.exec(
              'kubectl get ingress/snow-ingress -o jsonpath="{range .spec.rules[*]}{@.host}{\'\\n\'}{end}"'
            )
          ];
        case 6:
          stdout = _e.sent().stdout;
          domains = stdout.split('\n');
          if (domains.indexOf(domainName) !== -1) {
            utils_1.logError("Domain '" + domainName + "' already configured.");
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            utils_1.exec('kubectl get ingress/snow-ingress -o json')
          ];
        case 7:
          addIngressConfig = _e.sent().stdout;
          addSpec = addDomainToIngress(domainName, addIngressConfig).spec;
          return [
            4 /*yield*/,
            utils_1.exec(
              "kubectl patch ingress snow-ingress --patch '" +
                JSON.stringify({ spec: addSpec }) +
                "'"
            )
          ];
        case 8:
          _e.sent();
          hasSSLCert = true;
          _e.label = 9;
        case 9:
          _e.trys.push([9, 11, , 12]);
          return [
            4 /*yield*/,
            utils_1.exec('kubectl get secrets/' + domainName)
          ];
        case 10:
          _e.sent();
          return [3 /*break*/, 12];
        case 11:
          e_2 = _e.sent();
          hasSSLCert = false;
          return [3 /*break*/, 12];
        case 12:
          utils_1.logInfo("\u2705 Domain '" + domainName + "' added.");
          if (!hasSSLCert) {
            utils_1.logInfo('ℹ️  Wait a minute for SSL Certificate creation.');
          }
          return [3 /*break*/, 20];
        case 13:
          path =
            '{"Domains"}{"\\n\\n"}{range .items[*].spec.rules[*]}{.host}{"\\n"}{end}{"\\n"}';
          return [
            4 /*yield*/,
            utils_1.run("kubectl get ingress -o jsonpath='" + path + "'")
          ];
        case 14:
          _e.sent();
          return [3 /*break*/, 20];
        case 15:
          if (!domainName) {
            utils_1.logError('⚠️  No domain name specified.');
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            utils_1.exec('kubectl get ingress/snow-ingress -o json')
          ];
        case 16:
          rmIngressConfig = _e.sent().stdout;
          (_b = JSON.parse(rmIngressConfig).spec),
            (_c = _b.rules),
            (rules = _c === void 0 ? [] : _c),
            (_d = _b.tls),
            (tls = _d === void 0 ? [] : _d);
          patch = [
            rules.length && {
              op: 'replace',
              path: '/spec/rules',
              value: rules.filter(function(_a) {
                var host = _a.host;
                return host !== domainName;
              })
            },
            tls.length && {
              op: 'replace',
              path: '/spec/tls',
              value: tls.filter(function(_a) {
                var secretName = _a.secretName;
                return secretName !== domainName;
              })
            }
          ].filter(Boolean);
          return [
            4 /*yield*/,
            utils_1.exec(
              'kubectl get ingress/snow-ingress -o jsonpath="{range .spec.rules[*]}{@.host}{\'\\n\'}{end}"'
            )
          ];
        case 17:
          domainList = _e.sent().stdout;
          currDomains = domainList.split('\n');
          if (currDomains.indexOf(domainName) === -1) {
            utils_1.logError(
              "\u26A0\uFE0F  Domain '" +
                domainName +
                "' has no existing configuration."
            );
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            utils_1.exec(
              "kubectl patch ingress snow-ingress --type='json' --patch '" +
                JSON.stringify(patch) +
                "'"
            )
          ];
        case 18:
          _e.sent();
          utils_1.logInfo("\u2705  Domain '" + domainName + "' removed.");
          return [3 /*break*/, 20];
        case 19:
          {
            console.log('usage error');
          }
          _e.label = 20;
        case 20:
          return [2 /*return*/];
      }
    });
  });
};
//# sourceMappingURL=domains.js.map
