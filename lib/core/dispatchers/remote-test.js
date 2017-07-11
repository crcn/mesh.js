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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
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
var mesh_1 = require("@tandem/mesh");
describe(__filename + "#", function () {
    var createOptions = function (family, input, output) {
        if (!input || !output) {
            input = output = new events_1.EventEmitter();
        }
        return {
            family: family,
            testMessage: function () { return true; },
            adapter: {
                addListener: input.on.bind(input, "message"),
                send: output.emit.bind(output, "message")
            }
        };
    };
    it("can send and receive a remote message", function () { return __awaiter(_this, void 0, void 0, function () {
        var abus, bbus, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    abus = new mesh_1.RemoteBus(createOptions(), new mesh_1.CallbackDispatcher(function (_a) {
                        var text = _a.text;
                        return text.toUpperCase();
                    }));
                    bbus = new mesh_1.RemoteBus(abus);
                    _a = chai_1.expect;
                    return [4 /*yield*/, mesh_1.readAllChunks(bbus.dispatch({ text: "hello" }))];
                case 1:
                    _a.apply(void 0, [_c.sent()]).to.eql(["HELLO"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can send and receive a remote stream", function () { return __awaiter(_this, void 0, void 0, function () {
        var abus, bbus, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    abus = new mesh_1.RemoteBus(createOptions(), new mesh_1.CallbackDispatcher(function (_a) {
                        var text = _a.text;
                        return new mesh_1.TransformStream({
                            start: function (controller) {
                                text.split("").forEach(function (chunk) { return controller.enqueue(chunk); });
                                controller.close();
                            }
                        });
                    }));
                    bbus = new mesh_1.RemoteBus(abus);
                    _a = chai_1.expect;
                    return [4 /*yield*/, mesh_1.readAllChunks(bbus.dispatch({ text: "hello" }))];
                case 1:
                    _a.apply(void 0, [_c.sent()]).to.eql(["h", "e", "l", "l", "o"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can write chunks to a remote stream", function () { return __awaiter(_this, void 0, void 0, function () {
        var abus, bbus, _a, writable, readable, writer, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    abus = new mesh_1.RemoteBus(createOptions(), new mesh_1.CallbackDispatcher(function (message) {
                        return new mesh_1.TransformStream({
                            transform: function (chunk, controller) {
                                controller.enqueue(chunk.toUpperCase());
                            }
                        });
                    }));
                    bbus = new mesh_1.RemoteBus(abus);
                    _a = bbus.dispatch({}), writable = _a.writable, readable = _a.readable;
                    writer = writable.getWriter();
                    writer.write("a");
                    writer.write("b");
                    writer.write("c");
                    return [4 /*yield*/, writer.write("d")];
                case 1:
                    _d.sent();
                    writer.close();
                    _b = chai_1.expect;
                    return [4 /*yield*/, mesh_1.readAllChunks(readable)];
                case 2:
                    _b.apply(void 0, [_d.sent()]).to.eql(["A", "B", "C", "D"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can abort a remote stream", function () { return __awaiter(_this, void 0, void 0, function () {
        var abus, bbus, _a, writable, readable, writer, reader, error, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    abus = new mesh_1.RemoteBus(createOptions(), new mesh_1.CallbackDispatcher(function (message) {
                        return new mesh_1.TransformStream({
                            transform: function (chunk, controller) {
                                controller.enqueue(chunk.toUpperCase());
                            }
                        });
                    }));
                    bbus = new mesh_1.RemoteBus(abus);
                    _a = bbus.dispatch({}), writable = _a.writable, readable = _a.readable;
                    writer = writable.getWriter();
                    reader = readable.getReader();
                    writer.write("a").catch(function (e) { });
                    writer.write("b").catch(function (e) { });
                    writer.write("c").catch(function (e) { });
                    return [4 /*yield*/, writer.abort(new Error("Cannot write anymore"))];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, reader.read()];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _b.sent();
                    error = e_1;
                    return [3 /*break*/, 5];
                case 5:
                    chai_1.expect(error.message).to.equal("Writable side aborted");
                    return [2 /*return*/];
            }
        });
    }); });
    it("can cancel a read stream", function () { return __awaiter(_this, void 0, void 0, function () {
        var abus, bbus, _a, writable, readable, reader, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    abus = new mesh_1.RemoteBus(createOptions(), new mesh_1.CallbackDispatcher(function (_a) {
                        var text = _a.text;
                        return new mesh_1.TransformStream({
                            start: function (controller) {
                                text.split("").forEach(function (chunk) { return controller.enqueue(chunk.toUpperCase()); });
                            }
                        });
                    }));
                    bbus = new mesh_1.RemoteBus(abus);
                    _a = bbus.dispatch({ text: "abcde" }), writable = _a.writable, readable = _a.readable;
                    reader = readable.getReader();
                    _b = chai_1.expect;
                    return [4 /*yield*/, reader.read()];
                case 1:
                    _b.apply(void 0, [(_k.sent()).value]).to.equal("A");
                    _d = chai_1.expect;
                    return [4 /*yield*/, reader.read()];
                case 2:
                    _d.apply(void 0, [(_k.sent()).value]).to.equal("B");
                    _f = chai_1.expect;
                    return [4 /*yield*/, reader.read()];
                case 3:
                    _f.apply(void 0, [(_k.sent()).value]).to.equal("C");
                    reader.cancel("not interested");
                    _h = chai_1.expect;
                    return [4 /*yield*/, reader.read()];
                case 4:
                    _h.apply(void 0, [(_k.sent()).done]).to.equal(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("doesn\'t get re-dispatched against the same remote bus", function () { return __awaiter(_this, void 0, void 0, function () {
        var i, abus, bbus, _a, writable, readable;
        return __generator(this, function (_b) {
            i = 0;
            abus = new mesh_1.RemoteBus(createOptions(), new mesh_1.CallbackDispatcher(function (message) {
                i++;
                return abus.dispatch(message);
            }));
            bbus = new mesh_1.RemoteBus(abus);
            _a = bbus.dispatch({}), writable = _a.writable, readable = _a.readable;
            chai_1.expect(i).to.equal(1);
            return [2 /*return*/];
        });
    }); });
    it("gets re-dispatched against other remote busses", function () { return __awaiter(_this, void 0, void 0, function () {
        var i, abus, bbus, cbus, dbus, _a, writable, readable;
        return __generator(this, function (_b) {
            i = 0;
            abus = new mesh_1.RemoteBus(createOptions(), new mesh_1.CallbackDispatcher(function (message) {
                i++;
                return dbus.dispatch(message);
            }));
            bbus = new mesh_1.RemoteBus(abus);
            cbus = new mesh_1.RemoteBus(createOptions(), new mesh_1.CallbackDispatcher(function (message) {
                i++;
                return abus.dispatch(message);
            }));
            dbus = new mesh_1.RemoteBus(cbus);
            _a = bbus.dispatch({}), writable = _a.writable, readable = _a.readable;
            chai_1.expect(i).to.equal(2);
            return [2 /*return*/];
        });
    }); });
    it("defines the remote family type wen connected", function () { return __awaiter(_this, void 0, void 0, function () {
        var a, b, i, abus, bbus;
        return __generator(this, function (_a) {
            a = new events_1.EventEmitter();
            b = new events_1.EventEmitter();
            i = 0;
            abus = new mesh_1.RemoteBus(createOptions("a", a, b), new mesh_1.CallbackDispatcher(function (message) {
                i++;
                return bbus.dispatch(message);
            }));
            bbus = new mesh_1.RemoteBus(createOptions("b", b, a), new mesh_1.CallbackDispatcher(function (message) {
                i++;
                return bbus.dispatch(message);
            }));
            chai_1.expect(bbus["_destFamily"]).to.equal("a");
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=remote-test.js.map