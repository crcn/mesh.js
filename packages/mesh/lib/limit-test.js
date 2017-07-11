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
var test_1 = require("./test");
var index_1 = require("./index");
describe(__filename + "#", function () {
    it("can be created", function () {
        index_1.limit(function (a) { return a; });
    });
    it("can return yielded values by the target function", function () { return __awaiter(_this, void 0, void 0, function () {
        var fn, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fn = index_1.limit(function () { return index_1.through(function (a) { return a + 1; }); });
                    _a = chai_1.expect;
                    return [4 /*yield*/, index_1.readAll(index_1.pipe([1, 2, 3], fn(1)))];
                case 1:
                    _a.apply(void 0, [_c.sent()]).to.eql([2, 3, 4]);
                    _b = chai_1.expect;
                    return [4 /*yield*/, index_1.readAll(index_1.pipe([4, 5, 6], fn(1)))];
                case 2:
                    _b.apply(void 0, [_c.sent()]).to.eql([5, 6, 7]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can limit to one active call", function () { return __awaiter(_this, void 0, void 0, function () {
        var numCalls, fn, i1, i2, i3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    numCalls = 0;
                    fn = index_1.limit(function () { return numCalls++; }, 1);
                    i1 = fn();
                    i2 = fn();
                    i3 = fn();
                    i2.next();
                    return [4 /*yield*/, test_1.timeout(1)];
                case 1:
                    _a.sent();
                    chai_1.expect(numCalls).to.eql(1);
                    i1.next();
                    i3.next();
                    return [4 /*yield*/, test_1.timeout(1)];
                case 2:
                    _a.sent();
                    chai_1.expect(numCalls).to.eql(1);
                    i2.next();
                    return [4 /*yield*/, test_1.timeout(1)];
                case 3:
                    _a.sent();
                    chai_1.expect(numCalls).to.eql(2);
                    i1.next();
                    return [4 /*yield*/, test_1.timeout(1)];
                case 4:
                    _a.sent();
                    chai_1.expect(numCalls).to.eql(3);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can limit to two active calls", function () { return __awaiter(_this, void 0, void 0, function () {
        var numCalls, fn, i1, i2, i3, i4, i5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    numCalls = 0;
                    fn = index_1.limit(function () { return numCalls++; }, 2);
                    i1 = fn();
                    i2 = fn();
                    i3 = fn();
                    i4 = fn();
                    i5 = fn();
                    i2.next();
                    i1.next();
                    return [4 /*yield*/, test_1.timeout(1)];
                case 1:
                    _a.sent();
                    chai_1.expect(numCalls).to.eql(2);
                    i3.next();
                    i1.next();
                    return [4 /*yield*/, test_1.timeout(1)];
                case 2:
                    _a.sent();
                    chai_1.expect(numCalls).to.eql(3);
                    i3.next();
                    i2.next();
                    i4.next();
                    i5.next();
                    return [4 /*yield*/, test_1.timeout(1)];
                case 3:
                    _a.sent();
                    chai_1.expect(numCalls).to.eql(5);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=limit-test.js.map