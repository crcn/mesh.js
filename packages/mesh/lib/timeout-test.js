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
var test_1 = require("./test");
var chai_1 = require("chai");
var index_1 = require("./index");
var timeoutQuick = function (fn, createError) { return index_1.timeout(fn, 4, createError); };
describe(__filename + "#", function () {
    it("can return yielded values from a target function", function () { return __awaiter(_this, void 0, void 0, function () {
        var t, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    t = timeoutQuick(function (a) { return a + 1; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, index_1.readAll(t(1))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql([2]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can return yielded values from a sequence", function () { return __awaiter(_this, void 0, void 0, function () {
        var t, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    t = timeoutQuick(index_1.sequence(function (a) { return a + 1; }, function (b) { return b + 2; }, function (c) { return c + 3; }));
                    _a = chai_1.expect;
                    return [4 /*yield*/, index_1.readAll(t(1))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql([2, 3, 4]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can timeout", function () { return __awaiter(_this, void 0, void 0, function () {
        var t, iter, _a, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    t = timeoutQuick(index_1.sequence(function (a) { return a + 1; }, function (b) { return b + 2; }, function (c) { return c + 3; }));
                    iter = t(1);
                    return [4 /*yield*/, test_1.timeout(2)];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    _a = chai_1.expect;
                    return [4 /*yield*/, index_1.readAll(iter)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).to.eql([2, 3, 4]);
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _b.sent();
                    chai_1.expect(e_1.message).to.eql("Timeout calling function.");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it("can use a custom error message", function () { return __awaiter(_this, void 0, void 0, function () {
        var t, iter, _a, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    t = timeoutQuick(index_1.sequence(function (a) { return a + 1; }, function (b) { return b + 2; }, function (c) { return c + 3; }), function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return new Error("Timeout calling \"" + args.join(", ") + "\".");
                    });
                    iter = t(1);
                    return [4 /*yield*/, test_1.timeout(10)];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    _a = chai_1.expect;
                    return [4 /*yield*/, index_1.readAll(iter)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).to.eql([2, 3, 4]);
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _b.sent();
                    chai_1.expect(e_2.message).to.eql("Timeout calling \"1\".");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it("clears the timeout after each next() call", function () { return __awaiter(_this, void 0, void 0, function () {
        var t, iter, _a, _b, _c, e_3;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    t = timeoutQuick(index_1.sequence(function (a) { return a + 1; }, function (b) { return b + 2; }, function (c) { return c + 3; }));
                    iter = t(1);
                    return [4 /*yield*/, test_1.timeout(0)];
                case 1:
                    _d.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 2:
                    _a.apply(void 0, [_d.sent()]).to.eql({ value: 2, done: false });
                    return [4 /*yield*/, test_1.timeout(0)];
                case 3:
                    _d.sent();
                    _b = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 4:
                    _b.apply(void 0, [_d.sent()]).to.eql({ value: 3, done: false });
                    return [4 /*yield*/, test_1.timeout(0)];
                case 5:
                    _d.sent();
                    _c = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 6:
                    _c.apply(void 0, [_d.sent()]).to.eql({ value: 4, done: false });
                    _d.label = 7;
                case 7:
                    _d.trys.push([7, 10, , 11]);
                    return [4 /*yield*/, test_1.timeout(10)];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, iter.next()];
                case 9:
                    _d.sent();
                    return [3 /*break*/, 11];
                case 10:
                    e_3 = _d.sent();
                    chai_1.expect(e_3.message).to.eql("Timeout calling function.");
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); });
    it("re-throws an error from the target function", function () { return __awaiter(_this, void 0, void 0, function () {
        var t, err, iter, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t = timeoutQuick(function () {
                        return __generator(this, function (_a) {
                            throw new Error("some error");
                        });
                    });
                    iter = t();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, iter.next()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _a.sent();
                    err = e_4;
                    return [3 /*break*/, 4];
                case 4:
                    chai_1.expect(err.message).to.eql("some error");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=timeout-test.js.map