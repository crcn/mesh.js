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
var sift_1 = require("sift");
var mesh_1 = require("mesh");
var messages_1 = require("./messages");
var DSTailer = (function () {
    function DSTailer(target) {
        this.target = target;
        this._tails = {};
    }
    DSTailer.prototype.dispatch = function (message) {
        var _this = this;
        if (message.type === messages_1.DSTailRequest.DS_TAIL) {
            var tailRequest = message;
            if (!this._tails[tailRequest.collectionName]) {
                this._tails[tailRequest.collectionName] = [];
            }
            var tailCollection_1 = this._tails[tailRequest.collectionName];
            return new DuplexAsyncIterableIterator(function (input, output) {
                var writer = output.getWriter();
                var onChange = function (request, data) { return __awaiter(_this, void 0, void 0, function () {
                    var e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, writer.write(new messages_1.DSTailedOperation(request, data))];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                e_1 = _a.sent();
                                untail();
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                var tail = [sift_1.default(message.query), onChange];
                var untail = function () {
                    var i = tailCollection_1.indexOf(tail);
                    if (~i)
                        tailCollection_1.splice(i, 1);
                };
                input.pipeTo(new mesh_1.WritableStream({
                    abort: untail,
                    close: untail
                }));
                tailCollection_1.push(tail);
            });
        }
        else if ([messages_1.DSInsertRequest.DS_INSERT, messages_1.DSRemoveRequest.DS_REMOVE, messages_1.DSUpdateRequest.DS_UPDATE].indexOf(message.type) > -1) {
            return new DuplexAsyncIterableIterator(function (input, output) {
                var writer = output.getWriter();
                var tailCollection = _this._tails[message.collectionName] || [];
                _this.target.dispatch(message).readable.pipeTo(new mesh_1.WritableStream({
                    write: function (chunk) {
                        writer.write(chunk);
                        for (var _i = 0, tailCollection_2 = tailCollection; _i < tailCollection_2.length; _i++) {
                            var _a = tailCollection_2[_i], filter = _a[0], callback = _a[1];
                            if (filter(chunk)) {
                                callback(message, chunk);
                            }
                        }
                    }
                })).then(writer.close.bind(writer)).catch(writer.abort.bind(writer));
            });
        }
        else {
            return this.target.dispatch(message);
        }
    };
    return DSTailer;
}());
exports.DSTailer = DSTailer;
//# sourceMappingURL=tailer.js.map