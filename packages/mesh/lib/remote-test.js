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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var events_1 = require("events");
var _1 = require(".");
describe(__filename + "#", function () {
    var createOptions = function (_a, input, output) {
        var _b = (_a === void 0 ? {} : _a).timeout, timeout = _b === void 0 ? 100 : _b;
        if (!input || !output) {
            input = output = new events_1.EventEmitter();
        }
        return {
            timeout: timeout,
            adapter: {
                addListener: input.on.bind(input, "message"),
                send: input.emit.bind(input, "message")
            }
        };
    };
    it("can send and receive a remote message", function () { return __awaiter(_this, void 0, void 0, function () {
        var options, afn, bfn, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = createOptions();
                    afn = _1.remote(function () { return options; }, (function (_a) {
                        var text = _a.text;
                        return text.toUpperCase();
                    }));
                    bfn = _1.remote(function () { return options; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, _1.readAll(bfn({ text: "hello" }))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql(["HELLO"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can send and receive a remote stream", function () { return __awaiter(_this, void 0, void 0, function () {
        var options, afn, bfn, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = createOptions();
                    afn = _1.remote(function () { return options; }, function (_a) {
                        var text = _a.text;
                        var _i, _b, char;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _i = 0, _b = text.split("");
                                    _c.label = 1;
                                case 1:
                                    if (!(_i < _b.length)) return [3 /*break*/, 4];
                                    char = _b[_i];
                                    return [4 /*yield*/, char];
                                case 2:
                                    _c.sent();
                                    _c.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                    bfn = _1.remote(function () { return options; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, _1.readAll(bfn({ text: "hello" }))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql(["h", "e", "l", "l", "o"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can write chunks to a remote stream", function () { return __awaiter(_this, void 0, void 0, function () {
        var options, afn, bfn, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = createOptions();
                    afn = _1.remote(function () { return options; }, function () { return _1.through(function (char) { return char.toUpperCase(); }); });
                    bfn = _1.remote(function () { return options; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, _1.readAll(_1.pipe(["a", "b", "c", "d"], bfn({})))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql(["A", "B", "C", "D"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("doesn\'t get re-fned against the same remote function", function () { return __awaiter(_this, void 0, void 0, function () {
        var i, options, afn, bfn, iter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    options = createOptions();
                    afn = _1.remote(function () { return options; }, function (message) {
                        i++;
                        return afn(message);
                    });
                    bfn = _1.remote(function () { return options; });
                    return [4 /*yield*/, bfn({})];
                case 1:
                    iter = _a.sent();
                    return [4 /*yield*/, iter.next()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, iter.next()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, iter.next()];
                case 4:
                    _a.sent();
                    chai_1.expect(i).to.equal(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it("gets re-fned against other remote functions", function () { return __awaiter(_this, void 0, void 0, function () {
        var i, optionsA, afn, bfn, optionsB, dfn, iter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    optionsA = createOptions();
                    afn = _1.remote(function () { return optionsA; }, function (message) {
                        i++;
                        return dfn(message);
                    });
                    bfn = _1.remote(function () { return optionsA; });
                    optionsB = createOptions();
                    _1.remote(function () { return optionsB; }, function (message) {
                        i++;
                        return afn(message);
                    });
                    dfn = _1.remote(function () { return optionsB; });
                    iter = bfn({});
                    return [4 /*yield*/, iter.next()];
                case 1:
                    _a.sent();
                    chai_1.expect(i).to.equal(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it("ends a fn that takes too long to respond", function () { return __awaiter(_this, void 0, void 0, function () {
        var options, afn, bfn, cfn, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = createOptions({ timeout: 5 });
                    afn = _1.remote(function () { return options; }, function () { return "a"; });
                    bfn = _1.remote(function () { return options; }, function () { return "b"; });
                    cfn = _1.remote(function () { return options; }, function () { return "c"; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, _1.readAll(afn({ timeout: 0 }))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql(["b", "c"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can pass multiple arguments to remote functions", function () { return __awaiter(_this, void 0, void 0, function () {
        var options, add, remoteAdd, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = createOptions({ timeout: 5 });
                    add = _1.remote(function () { return options; }, function (a, b) { return a + b; });
                    remoteAdd = _1.remote(function () { return options; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, _1.readAll(remoteAdd(1, 2))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql([3]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("ends a remote call if the caller returns the iterator", function () { return __awaiter(_this, void 0, void 0, function () {
        var options, repeat, remoteRepeat, _a, iter, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    options = createOptions({ timeout: 5 });
                    repeat = _1.remote(function () { return options; }, function (_a) {
                        var n = _a.n;
                        var i;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    i = n;
                                    _b.label = 1;
                                case 1:
                                    if (!i--) return [3 /*break*/, 4];
                                    return [4 /*yield*/, i];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3: return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                    remoteRepeat = _1.remote(function () { return options; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, _1.readAll(remoteRepeat({ n: 4 }))];
                case 1:
                    _a.apply(void 0, [_d.sent()]).to.eql([3, 2, 1, 0]);
                    iter = remoteRepeat({ n: 3 });
                    _b = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 2:
                    _b.apply(void 0, [_d.sent()]).to.eql({ value: 2, done: false });
                    return [4 /*yield*/, iter.return()];
                case 3:
                    _d.sent();
                    _c = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 4:
                    _c.apply(void 0, [_d.sent()]).to.eql({ value: undefined, done: true });
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=remote-test.js.map