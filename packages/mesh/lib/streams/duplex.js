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
Object.defineProperty(exports, "__esModule", { value: true });
var std_1 = require("./std");
var utils_1 = require("./utils");
var ChunkQueue = (function () {
    function ChunkQueue() {
        this._reads = [];
        this._writes = [];
    }
    ChunkQueue.prototype.push = function (value) {
        var _this = this;
        if (this._reads.length) {
            this._reads.shift()(value);
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            _this._writes.push([value, resolve, reject]);
        });
    };
    Object.defineProperty(ChunkQueue.prototype, "size", {
        get: function () {
            return this._writes.length;
        },
        enumerable: true,
        configurable: true
    });
    ChunkQueue.prototype.shift = function () {
        var _this = this;
        if (this._writes.length) {
            var _a = this._writes.shift(), value = _a[0], resolve = _a[1];
            resolve();
            return Promise.resolve(value);
        }
        return new Promise(function (resolve) {
            _this._reads.push(resolve);
        });
    };
    ChunkQueue.prototype.cancel = function (reason) {
        var writes = this._writes.concat();
        this._writes = [];
        for (var _i = 0, writes_1 = writes; _i < writes_1.length; _i++) {
            var _a = writes_1[_i], value = _a[0], resolve = _a[1], reject = _a[2];
            reject(reason);
        }
    };
    return ChunkQueue;
}());
exports.ChunkQueue = ChunkQueue;
var ReadableWritableStream = (function () {
    function ReadableWritableStream(stream) {
        var readerController;
        var writerController;
        var cancelReason;
        var abortReason;
        var _writePromise = Promise.resolve();
        var queue = new ChunkQueue();
        var close = function (reason) {
            queue.cancel(reason);
            if (stream.$response.close) {
                stream.$response.close(reason);
            }
        };
        var output = this.readable = new std_1.ReadableStream({
            start: function (controller) {
                readerController = controller;
            },
            pull: function (controller) {
                return queue.shift().then(function (value) {
                    readerController.enqueue(value);
                });
            },
            cancel: function (reason) {
                cancelReason = reason;
                close(reason);
            }
        });
        var inputAborted;
        var input = this.writable = new std_1.WritableStream({
            start: function (controller) {
                writerController = controller;
            },
            write: function (chunk) {
                // need to eat the chunk here. Streams will re-throw
                // any exception that are occur in in sink.write()
                if (cancelReason)
                    return;
                return _writePromise = queue.push(chunk);
            },
            close: function () {
                if (cancelReason)
                    return;
                var close = function () {
                    readerController.close();
                };
                return _writePromise.then(close, close);
            },
            abort: function (reason) {
                if (cancelReason)
                    return;
                abortReason = reason;
                readerController.error(reason);
                close(reason);
            }
        });
    }
    return ReadableWritableStream;
}());
function wrapDuplexStream(value) {
    if (value && value.readable && value.writable) {
        if (value.writable) {
            return value;
        }
    }
    if (value instanceof std_1.ReadableStream) {
        var readable_1 = value;
        return new std_1.TransformStream({
            start: function (controller) {
                readable_1.pipeTo(new std_1.WritableStream({
                    write: function (chunk) {
                        controller.enqueue(chunk);
                    },
                    abort: function (error) {
                        controller.error(error);
                    },
                    close: function () {
                        controller.close();
                    }
                }));
            }
        });
    }
    return new std_1.TransformStream({
        start: function (controller) {
            return __awaiter(this, void 0, void 0, function () {
                var v;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, value];
                        case 1:
                            v = _a.sent();
                            if (v != null) {
                                if (Array.isArray(v)) {
                                    v.forEach(function (i) { return controller.enqueue(i); });
                                }
                                else {
                                    controller.enqueue(v);
                                }
                            }
                            controller.close();
                            return [2 /*return*/];
                    }
                });
            });
        }
    });
}
exports.wrapDuplexStream = wrapDuplexStream;
var DuplexStream = (function () {
    function DuplexStream(handler) {
        var input = this._input = new ReadableWritableStream(this);
        var output = this._output = new ReadableWritableStream(this);
        this.$response = handler(input.readable, output.writable) || {};
    }
    DuplexStream.empty = function () {
        return new DuplexStream(function (input, output) {
            output.getWriter().close();
        });
    };
    DuplexStream.fromArray = function (items) {
        return new DuplexStream(function (input, output) {
            var writer = output.getWriter();
            items.forEach(function (item) { return writer.write(item); });
            writer.close();
        });
    };
    DuplexStream.prototype.then = function (resolve, reject) {
        return utils_1.readAllChunks(this).then(resolve, reject);
    };
    Object.defineProperty(DuplexStream.prototype, "writable", {
        get: function () {
            return this._input.writable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DuplexStream.prototype, "readable", {
        get: function () {
            return this._output.readable;
        },
        enumerable: true,
        configurable: true
    });
    return DuplexStream;
}());
exports.DuplexStream = DuplexStream;
exports.createDuplexStream = function (handler) { return new DuplexStream(handler); };
//# sourceMappingURL=duplex.js.map