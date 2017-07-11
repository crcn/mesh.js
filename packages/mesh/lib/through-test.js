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
var index_1 = require("./index");
var chai_1 = require("chai");
describe("through#", function () {
    it("can be used with a vanilla adder function", function () { return __awaiter(_this, void 0, void 0, function () {
        var iter, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    iter = index_1.through(function (value) { return value + 1; });
                    _a = chai_1.expect;
                    return [4 /*yield*/, iter.next(1)];
                case 1:
                    _a.apply(void 0, [(_c.sent()).value]).to.eql(2);
                    _b = chai_1.expect;
                    return [4 /*yield*/, iter.next(2)];
                case 2:
                    _b.apply(void 0, [(_c.sent()).value]).to.eql(3);
                    return [2 /*return*/];
            }
        });
    }); });
    it("yields all results from target function to iterator", function () { return __awaiter(_this, void 0, void 0, function () {
        var iter, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    iter = index_1.through(function (amount) {
                        var i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    i = amount;
                                    _a.label = 1;
                                case 1:
                                    if (!i--) return [3 /*break*/, 4];
                                    return [4 /*yield*/, i];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                    _a = chai_1.expect;
                    return [4 /*yield*/, iter.next(5)];
                case 1:
                    _a.apply(void 0, [(_f.sent()).value]).to.eql(4);
                    _b = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 2:
                    _b.apply(void 0, [(_f.sent()).value]).to.eql(3);
                    _c = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 3:
                    _c.apply(void 0, [(_f.sent()).value]).to.eql(2);
                    _d = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 4:
                    _d.apply(void 0, [(_f.sent()).value]).to.eql(1);
                    _e = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 5:
                    _e.apply(void 0, [(_f.sent()).value]).to.eql(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it("finishes if there are no more inputs", function () { return __awaiter(_this, void 0, void 0, function () {
        var iter, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    iter = index_1.through(function (amount) {
                        var i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    i = amount;
                                    _a.label = 1;
                                case 1:
                                    if (!i--) return [3 /*break*/, 4];
                                    return [4 /*yield*/, i];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                    _a = chai_1.expect;
                    return [4 /*yield*/, iter.next(3)];
                case 1:
                    _a.apply(void 0, [(_f.sent()).value]).to.eql(2);
                    _b = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 2:
                    _b.apply(void 0, [(_f.sent()).value]).to.eql(1);
                    _c = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 3:
                    _c.apply(void 0, [(_f.sent()).value]).to.eql(0);
                    _d = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 4:
                    _d.apply(void 0, [(_f.sent()).done]).to.eql(true);
                    _e = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 5:
                    _e.apply(void 0, [(_f.sent()).done]).to.eql(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("finishes yielding the current through iterator before running the next", function () { return __awaiter(_this, void 0, void 0, function () {
        var iter, _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    iter = index_1.through(function (amount) {
                        var i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    i = amount;
                                    _a.label = 1;
                                case 1:
                                    if (!i--) return [3 /*break*/, 4];
                                    return [4 /*yield*/, i];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                    _a = chai_1.expect;
                    return [4 /*yield*/, iter.next(4)];
                case 1:
                    _a.apply(void 0, [(_j.sent()).value]).to.eql(3);
                    _b = chai_1.expect;
                    return [4 /*yield*/, iter.next(3)];
                case 2:
                    _b.apply(void 0, [(_j.sent()).value]).to.eql(2);
                    _c = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 3:
                    _c.apply(void 0, [(_j.sent()).value]).to.eql(1);
                    _d = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 4:
                    _d.apply(void 0, [(_j.sent()).value]).to.eql(0);
                    _e = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 5:
                    _e.apply(void 0, [(_j.sent()).value]).to.eql(2);
                    _f = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 6:
                    _f.apply(void 0, [(_j.sent()).value]).to.eql(1);
                    _g = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 7:
                    _g.apply(void 0, [(_j.sent()).value]).to.eql(0);
                    _h = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 8:
                    _h.apply(void 0, [(_j.sent()).done]).to.eql(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can keep open", function () { return __awaiter(_this, void 0, void 0, function () {
        var iter, _a, _b, p, p2, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    iter = index_1.through(function (amount) {
                        var i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    i = amount;
                                    _a.label = 1;
                                case 1:
                                    if (!i--) return [3 /*break*/, 4];
                                    return [4 /*yield*/, i];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }, true);
                    _a = chai_1.expect;
                    return [4 /*yield*/, iter.next(2)];
                case 1:
                    _a.apply(void 0, [(_f.sent()).value]).to.eql(1);
                    _b = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 2:
                    _b.apply(void 0, [(_f.sent()).value]).to.eql(0);
                    p = iter.next();
                    p2 = iter.next(3);
                    _c = chai_1.expect;
                    return [4 /*yield*/, p];
                case 3:
                    _c.apply(void 0, [(_f.sent()).value]).to.eq(2);
                    _d = chai_1.expect;
                    return [4 /*yield*/, p2];
                case 4:
                    _d.apply(void 0, [(_f.sent()).value]).to.eql(1);
                    _e = chai_1.expect;
                    return [4 /*yield*/, iter.next()];
                case 5:
                    _e.apply(void 0, [(_f.sent()).value]).to.eql(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=through-test.js.map