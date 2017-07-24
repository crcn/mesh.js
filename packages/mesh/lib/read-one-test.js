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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var read_one_1 = require("./read-one");
describe(__filename + "#", function () {
    it("can read one chunk from an async generator", function () { return __awaiter(_this, void 0, void 0, function () {
        var fn, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fn = function () {
                        return __asyncGenerator(this, arguments, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, 1];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    };
                    _a = chai_1.expect;
                    return [4 /*yield*/, read_one_1.readOne(fn())];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it("closes an async generator after readOne is called", function () { return __awaiter(_this, void 0, void 0, function () {
        var closed, fn, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    closed = false;
                    fn = function () {
                        var _this = this;
                        return _a = {},
                            _a[Symbol.asyncIterator] = function () { return _this; },
                            _a.next = function () {
                                return Promise.resolve({ value: 1, done: false });
                            },
                            _a.return = function () {
                                closed = true;
                                return Promise.resolve();
                            },
                            _a;
                        var _a;
                    };
                    _a = chai_1.expect;
                    return [4 /*yield*/, read_one_1.readOne(fn())];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql(1);
                    chai_1.expect(closed).to.eql(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can keep an async generator open", function () { return __awaiter(_this, void 0, void 0, function () {
        var closed, chunks, fn, gen, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    closed = false;
                    chunks = [1, 2, 3];
                    fn = function () {
                        var _this = this;
                        return _a = {},
                            _a[Symbol.asyncIterator] = function () { return _this; },
                            _a.next = function () {
                                return chunks.length ? Promise.resolve({ value: chunks.shift(), done: false }) : Promise.resolve({ done: true });
                            },
                            _a.return = function () {
                                closed = true;
                                return Promise.resolve();
                            },
                            _a;
                        var _a;
                    };
                    gen = fn();
                    _a = chai_1.expect;
                    return [4 /*yield*/, read_one_1.readOne(gen, false)];
                case 1:
                    _a.apply(void 0, [_d.sent()]).to.eql(1);
                    chai_1.expect(closed).to.eql(false);
                    _b = chai_1.expect;
                    return [4 /*yield*/, read_one_1.readOne(gen, false)];
                case 2:
                    _b.apply(void 0, [_d.sent()]).to.eql(2);
                    chai_1.expect(closed).to.eql(false);
                    _c = chai_1.expect;
                    return [4 /*yield*/, read_one_1.readOne(gen, false)];
                case 3:
                    _c.apply(void 0, [_d.sent()]).to.eql(3);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=read-one-test.js.map