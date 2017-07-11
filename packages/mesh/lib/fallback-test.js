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
var index_1 = require("./index");
describe(__filename + "#", function () {
    it("can be created", function () {
        index_1.fallback();
    });
    it("can return values from the first function", function () { return __awaiter(_this, void 0, void 0, function () {
        var fn, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fn = index_1.fallback(function (m) { return "a"; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, index_1.readAll(fn({}))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql(["a"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can return values from the second function if the first doesn't return anything", function () { return __awaiter(_this, void 0, void 0, function () {
        var fn, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fn = index_1.fallback(function (m) { return undefined; }, function (m) { return "b"; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, index_1.readAll(fn({}))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql(["b"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can return all yields from the first function, and not the rest", function () { return __awaiter(_this, void 0, void 0, function () {
        var fn, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fn = index_1.fallback(function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, "a"];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, "b"];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, "c"];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }, function (m) { return "d"; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, index_1.readAll(fn({}))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql(["a", "b", "c"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can take input data", function () { return __awaiter(_this, void 0, void 0, function () {
        var fn, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fn = index_1.fallback(function (m) { return index_1.through(function (a) { return -a; }); }, function (m) { return "d"; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, index_1.readAll(index_1.pipe([1, 2, 3], fn({})))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql([-1, -2, -3]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("passes errors from target functions to async generator promises", function () { return __awaiter(_this, void 0, void 0, function () {
        var fn, iter, _a, err, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fn = index_1.fallback(function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, 1];
                                case 1:
                                    _a.sent();
                                    throw new Error("some error");
                            }
                        });
                    });
                    iter = fn();
                    _a = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql({ value: 1, done: false });
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, iter.next()];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _b.sent();
                    err = e_1;
                    return [3 /*break*/, 5];
                case 5:
                    chai_1.expect(err.message).to.eql("some error");
                    return [2 /*return*/];
            }
        });
    }); });
    it("runs the next target if the first throws an error immediately", function () { return __awaiter(_this, void 0, void 0, function () {
        var fn, iter, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fn = index_1.fallback(function () {
                        return __generator(this, function (_a) {
                            throw new Error("some error");
                        });
                    }, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, 1];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                    iter = fn();
                    _a = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 1:
                    _a.apply(void 0, [_c.sent()]).to.eql({ value: 1, done: false });
                    _b = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 2:
                    _b.apply(void 0, [_c.sent()]).to.eql({ value: undefined, done: true });
                    return [2 /*return*/];
            }
        });
    }); });
    it("throws an error if the first target yields a value then throws an error", function () { return __awaiter(_this, void 0, void 0, function () {
        var fn, iter, _a, err, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fn = index_1.fallback(function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, 1];
                                case 1:
                                    _a.sent();
                                    throw new Error("some error");
                            }
                        });
                    }, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, 2];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                    iter = fn();
                    _a = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql({ value: 1, done: false });
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, iter.next()];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _b.sent();
                    err = e_2;
                    return [3 /*break*/, 5];
                case 5:
                    chai_1.expect(err.message).to.eql("some error");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=fallback-test.js.map