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
var _1 = require(".");
var chai_1 = require("chai");
describe(__filename + "#", function () {
    it("can be created", function () {
        _1.random();
    });
    it("can call randomly against different targets", function () { return __awaiter(_this, void 0, void 0, function () {
        var fn, counts, i, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fn = _1.random(function (m) { return 1; }, function (m) { return 2; }, function (m) { return 3; });
                    counts = { 1: 0, 2: 0, 3: 0 };
                    i = 1000;
                    _b.label = 1;
                case 1:
                    if (!i--) return [3 /*break*/, 4];
                    _a = counts;
                    return [4 /*yield*/, fn({}).next()];
                case 2:
                    _a[(_b.sent()).value]++;
                    _b.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4:
                    chai_1.expect(counts[1] !== counts[2] !== counts[3]).to.eql(true);
                    chai_1.expect(counts[1] > 0).to.eql(true);
                    chai_1.expect(counts[2] > 0).to.eql(true);
                    chai_1.expect(counts[3] > 0).to.eql(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can add a 0 weight to a target", function () { return __awaiter(_this, void 0, void 0, function () {
        var fn, counts, i, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fn = _1.random([3, function (m) { return 1; }], [1, function (m) { return 2; }], [0, function (m) { return 3; }]);
                    counts = { 1: 0, 2: 0, 3: 0 };
                    i = 1000;
                    _b.label = 1;
                case 1:
                    if (!i--) return [3 /*break*/, 4];
                    _a = counts;
                    return [4 /*yield*/, fn({}).next()];
                case 2:
                    _a[(_b.sent()).value]++;
                    _b.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4:
                    chai_1.expect(counts[3]).to.eql(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can add more weight to one target", function () { return __awaiter(_this, void 0, void 0, function () {
        var fn, counts, n, i, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fn = _1.random([5, function (m) { return 1; }], [1, function (m) { return 2; }], [1, function (m) { return 3; }]);
                    counts = { 1: 0, 2: 0, 3: 0 };
                    n = 2000;
                    i = n;
                    _b.label = 1;
                case 1:
                    if (!i--) return [3 /*break*/, 4];
                    _a = counts;
                    return [4 /*yield*/, fn({}).next()];
                case 2:
                    _a[(_b.sent()).value]++;
                    _b.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4:
                    chai_1.expect(counts[1] > 0.6).to.eql(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=random-test.js.map