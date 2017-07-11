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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var chai_1 = require("chai");
describe(__filename + "#", function () {
    it("can use a pipeline with just one iterator", function () {
        return __awaiter(this, void 0, void 0, function () {
            var pipeline, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        pipeline = index_1.pipe((function () {
                            return __asyncGenerator(this, arguments, function () {
                                var i;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            i = 0;
                                            _a.label = 1;
                                        case 1:
                                            if (!true) return [3 /*break*/, 3];
                                            return [4 /*yield*/, i + 1];
                                        case 2:
                                            i = _a.sent();
                                            return [3 /*break*/, 1];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            });
                        })());
                        _a = chai_1.expect;
                        return [4 /*yield*/, pipeline.next(1)];
                    case 1:
                        _a.apply(void 0, [(_e.sent()).value]).to.eql(1);
                        _b = chai_1.expect;
                        return [4 /*yield*/, pipeline.next(2)];
                    case 2:
                        _b.apply(void 0, [(_e.sent()).value]).to.eql(3);
                        _c = chai_1.expect;
                        return [4 /*yield*/, pipeline.next(3)];
                    case 3:
                        _c.apply(void 0, [(_e.sent()).value]).to.eql(4);
                        _d = chai_1.expect;
                        return [4 /*yield*/, pipeline.next(4)];
                    case 4:
                        _d.apply(void 0, [(_e.sent()).value]).to.eql(5);
                        return [2 /*return*/];
                }
            });
        });
    });
    it("can pipe with a through call", function () {
        return __awaiter(this, void 0, void 0, function () {
            var pipeline, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        pipeline = index_1.pipe(index_1.through(function (v) { return v + 1; }));
                        _a = chai_1.expect;
                        return [4 /*yield*/, pipeline.next(1)];
                    case 1:
                        _a.apply(void 0, [(_d.sent()).value]).to.eq(2);
                        _b = chai_1.expect;
                        return [4 /*yield*/, pipeline.next(5)];
                    case 2:
                        _b.apply(void 0, [(_d.sent()).value]).to.eq(6);
                        _c = chai_1.expect;
                        return [4 /*yield*/, pipeline.next()];
                    case 3:
                        _c.apply(void 0, [(_d.sent()).done]).to.eq(true);
                        return [2 /*return*/];
                }
            });
        });
    });
    it("can pipe with multiple throughs", function () {
        return __awaiter(this, void 0, void 0, function () {
            var pipeline, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        pipeline = index_1.pipe(index_1.through(function (v) { return String(v).toUpperCase(); }), index_1.through(function (v) { return v + "!"; }), index_1.through(function (v) { return v + "!!??"; }));
                        _a = chai_1.expect;
                        return [4 /*yield*/, pipeline.next("one")];
                    case 1:
                        _a.apply(void 0, [(_d.sent()).value]).to.eq("ONE!!!??");
                        _b = chai_1.expect;
                        return [4 /*yield*/, pipeline.next("five")];
                    case 2:
                        _b.apply(void 0, [(_d.sent()).value]).to.eq("FIVE!!!??");
                        _c = chai_1.expect;
                        return [4 /*yield*/, pipeline.next()];
                    case 3:
                        _c.apply(void 0, [(_d.sent()).done]).to.eq(true);
                        return [2 /*return*/];
                }
            });
        });
    });
    it("can use an array as an argument", function () {
        return __awaiter(this, void 0, void 0, function () {
            var pipeline, _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        pipeline = index_1.pipe([1, 2, 3, 4], index_1.through(function (v) { return -v; }));
                        _a = chai_1.expect;
                        return [4 /*yield*/, pipeline.next()];
                    case 1:
                        _a.apply(void 0, [(_f.sent()).value]).to.eq(-1);
                        _b = chai_1.expect;
                        return [4 /*yield*/, pipeline.next()];
                    case 2:
                        _b.apply(void 0, [(_f.sent()).value]).to.eq(-2);
                        _c = chai_1.expect;
                        return [4 /*yield*/, pipeline.next()];
                    case 3:
                        _c.apply(void 0, [(_f.sent()).value]).to.eq(-3);
                        _d = chai_1.expect;
                        return [4 /*yield*/, pipeline.next()];
                    case 4:
                        _d.apply(void 0, [(_f.sent()).value]).to.eq(-4);
                        _e = chai_1.expect;
                        return [4 /*yield*/, pipeline.next()];
                    case 5:
                        _e.apply(void 0, [(_f.sent()).done]).to.eq(true);
                        return [2 /*return*/];
                }
            });
        });
    });
    it("can be used in conjuction with readAll", function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = chai_1.expect;
                        return [4 /*yield*/, index_1.readAll(index_1.pipe([1, 2, 3], index_1.through(function (v) { return -v; })))];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eql([-1, -2, -3]);
                        return [2 /*return*/];
                }
            });
        });
    });
    it("calls return on all async iterables after the pipeline as finished", function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _returned, pipeline, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _returned = 0;
                        pipeline = index_1.pipe([1, 2, 3], (_b = {},
                            _b[Symbol.asyncIterator] = function () { return _this; },
                            _b.next = function (v) { return Promise.resolve({ value: v + 1, done: false }); },
                            _b.return = function () {
                                _returned++;
                            },
                            _b), (_c = {},
                            _c[Symbol.asyncIterator] = function () { return _this; },
                            _c.next = function (v) { return Promise.resolve({ value: -v, done: false }); },
                            _c.return = function () {
                                _returned++;
                            },
                            _c));
                        _a = chai_1.expect;
                        return [4 /*yield*/, index_1.readAll(pipeline)];
                    case 1:
                        _a.apply(void 0, [_d.sent()]).to.eql([-2, -3, -4]);
                        chai_1.expect(_returned).to.eql(2);
                        return [2 /*return*/];
                }
            });
        });
    });
});
//# sourceMappingURL=pipe-test.js.map