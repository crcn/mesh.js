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
var mesh_1 = require("@tandem/mesh");
var callback_1 = require("./callback");
describe(__filename + "#", function () {
    it("can be created", function () {
        new mesh_1.ParallelBus([]);
    });
    it("dispatch a message against one entry", function () { return __awaiter(_this, void 0, void 0, function () {
        var i, bus;
        return __generator(this, function (_a) {
            i = 0;
            bus = new mesh_1.ParallelBus([
                new callback_1.CallbackBus(function (m) { return i++; })
            ]);
            bus.dispatch({});
            bus.dispatch({});
            bus.dispatch({});
            chai_1.expect(i).to.equal(3);
            return [2 /*return*/];
        });
    }); });
    it("dispatches a message against multiple busses", function () { return __awaiter(_this, void 0, void 0, function () {
        var i, bus, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    i = 0;
                    bus = new mesh_1.ParallelBus([
                        new callback_1.CallbackBus(function (m) { return i++; }),
                        new callback_1.CallbackBus(function (m) { return i++; }),
                        new callback_1.CallbackBus(function (m) { return i++; })
                    ]);
                    _a = chai_1.expect;
                    return [4 /*yield*/, mesh_1.readAllChunks(bus.dispatch({}).readable)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql([0, 1, 2]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Can handle a bus that returns a rejection", function () { return __awaiter(_this, void 0, void 0, function () {
        var i, bus, error, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    bus = new mesh_1.ParallelBus([
                        new callback_1.CallbackBus(function (m) { return i++; }),
                        new callback_1.CallbackBus(function (m) { return Promise.reject(new Error("some error")); })
                    ]);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, mesh_1.readAllChunks(bus.dispatch({}).readable)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    error = e_1;
                    return [3 /*break*/, 4];
                case 4:
                    chai_1.expect(error).not.to.be.undefined;
                    chai_1.expect(error.message).to.equal("some error");
                    return [2 /*return*/];
            }
        });
    }); });
    it("Can cancel a request", function () { return __awaiter(_this, void 0, void 0, function () {
        var i, bus, readable, reader, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    i = 0;
                    bus = new mesh_1.ParallelBus([
                        new callback_1.CallbackBus(function (m) { return i++; }),
                        new callback_1.CallbackBus(function (m) { return i++; }),
                        new callback_1.CallbackBus(function (m) { return i++; }),
                        new callback_1.CallbackBus(function (m) { return i++; }),
                        new callback_1.CallbackBus(function (m) { return i++; })
                    ]);
                    readable = bus.dispatch({}).readable;
                    reader = readable.getReader();
                    _a = chai_1.expect;
                    return [4 /*yield*/, reader.read()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql({ value: 0, done: false });
                    return [4 /*yield*/, reader.cancel("no reason")];
                case 2:
                    _b.sent();
                    chai_1.expect(i).to.equal(5);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can nest parallel busses", function () { return __awaiter(_this, void 0, void 0, function () {
        var i, bus, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    i = 0;
                    bus = new mesh_1.ParallelBus([
                        new mesh_1.ParallelBus([
                            new callback_1.CallbackBus(function (m) { return i++; }),
                            new callback_1.CallbackBus(function (m) { return i++; }),
                            new callback_1.CallbackBus(function (m) { return i++; })
                        ]),
                        new callback_1.CallbackBus(function (m) { return i++; })
                    ]);
                    _a = chai_1.expect;
                    return [4 /*yield*/, mesh_1.readAllChunks(bus.dispatch({}).readable)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eql([3, 0, 1, 2]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can write & read transformed data to a request", function () { return __awaiter(_this, void 0, void 0, function () {
        var bus, _a, writable, readable, writer, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    bus = new mesh_1.ParallelBus([
                        new callback_1.CallbackBus(function (m) { return new mesh_1.DuplexStream(function (input, output) {
                            var writer = output.getWriter();
                            input.pipeTo(new mesh_1.WritableStream({
                                write: function (chunk) {
                                    var p = [];
                                    for (var i = chunk; i >= 0; i--) {
                                        p.push(writer.write(i));
                                    }
                                    return Promise.all(p);
                                },
                                close: function () {
                                    writer.close();
                                }
                            }));
                        }); })
                    ]);
                    _a = bus.dispatch({}), writable = _a.writable, readable = _a.readable;
                    writer = writable.getWriter();
                    return [4 /*yield*/, writer.write(1)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, writer.write(2)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, writer.close()];
                case 3:
                    _c.sent();
                    _b = chai_1.expect;
                    return [4 /*yield*/, mesh_1.readAllChunks(readable)];
                case 4:
                    _b.apply(void 0, [_c.sent()]).to.eql([1, 0, 2, 1, 0]);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=parallel-test.js.map