"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("./channel");
var chai_1 = require("chai");
var lodash_1 = require("lodash");
var read_one_1 = require("./read-one");
var read_all_1 = require("./read-all");
describe(__filename + "#", function () {
    it("can pass values through an open channel", function () { return __awaiter(_this, void 0, void 0, function () {
        var call, c, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    call = function (a) {
                        return channel_1.outlet(function () { return function (b) {
                            return a + b;
                        }; });
                    };
                    c = channel_1.inlet(call(5), lodash_1.noop);
                    _a = chai_1.expect;
                    return [4 /*yield*/, c(6).next()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql({ value: 11, done: false });
                    return [2 /*return*/];
            }
        });
    }); });
    it("can yield multiple values through a channel", function () { return __awaiter(_this, void 0, void 0, function () {
        var call, iter, c, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    call = function (a) {
                        return channel_1.outlet(function () { return function (b) {
                            return __asyncGenerator(this, arguments, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [5 /*yield**/, __values(__asyncDelegator(__asyncValues([a + b + 1, a + b + 2, a + b + 3])))];
                                        case 1: return [4 /*yield*/, __await.apply(void 0, [_a.sent()])];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        }; });
                    };
                    iter = call(5);
                    c = channel_1.inlet(iter, lodash_1.noop);
                    _a = chai_1.expect;
                    return [4 /*yield*/, read_all_1.readAll(c(6))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql([12, 13, 14]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can nest a channel within a channel", function () { return __awaiter(_this, void 0, void 0, function () {
        var call, iter, c, c2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    call = function (a) {
                        return channel_1.outlet(function () { return function (b) {
                            return channel_1.outlet(function () { return function (c) {
                                return a + b + c;
                            }; });
                        }; });
                    };
                    iter = call(5);
                    c = channel_1.inlet(call(5), lodash_1.noop);
                    c2 = channel_1.inlet(c(6), lodash_1.noop);
                    _a = chai_1.expect;
                    return [4 /*yield*/, c2(7).next()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql({ value: 18, done: false });
                    return [2 /*return*/];
            }
        });
    }); });
    it("can nest a channel within a channel within a channel", function () { return __awaiter(_this, void 0, void 0, function () {
        var call, iter, c, c2, c3, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    call = function (a) {
                        return channel_1.outlet(function () { return function (b) {
                            return channel_1.outlet(function () { return function (c) {
                                return channel_1.outlet(function () { return function (d) {
                                    return a + b + c + d;
                                }; });
                            }; });
                        }; });
                    };
                    iter = call(5);
                    c = channel_1.inlet(call(5), lodash_1.noop);
                    c2 = channel_1.inlet(c(6), lodash_1.noop);
                    c3 = channel_1.inlet(c2(7), lodash_1.noop);
                    _a = chai_1.expect;
                    return [4 /*yield*/, c3(8).next()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql({ value: 26, done: false });
                    return [2 /*return*/];
            }
        });
    }); });
    it("can call the outer target function from an inner", function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        var call, c, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    call = function (a) {
                        return channel_1.outlet(function (upstream) { return function (b) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, read_one_1.readOne(upstream(a + b))];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); }; });
                    };
                    c = channel_1.inlet(call(5), function (v) { return v * 2; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, read_one_1.readOne(c(7))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql(24);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can call the outer target function from an nested inner", function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        var call, c, c2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    call = function (a) {
                        return channel_1.outlet(function (u1) { return function (b) { return channel_1.outlet(function (u2) { return function (c) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _a = read_one_1.readOne;
                                        _b = u1;
                                        return [4 /*yield*/, read_one_1.readOne(u2(a + b + c))];
                                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.apply(void 0, [_c.sent()])])];
                                    case 2: return [2 /*return*/, _c.sent()];
                                }
                            });
                        }); }; }); }; });
                    };
                    c = channel_1.inlet(call(5), function (v) { return v * 2; });
                    c2 = channel_1.inlet(c(5), function (v) { return v * 3; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, read_one_1.readOne(c2(7))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql(102);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=channel-test.js.map