"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var mesh_1 = require("mesh");
var sift_1 = require("sift");
var DSMessage = (function () {
    function DSMessage(type, collectionName) {
        this.type = type;
        this.collectionName = collectionName;
        this.timestamp = Date.now();
    }
    return DSMessage;
}());
exports.DSMessage = DSMessage;
// @serializable("DSInsertRequest")
var DSInsertRequest = (function (_super) {
    __extends(DSInsertRequest, _super);
    function DSInsertRequest(collectionName, data) {
        var _this = _super.call(this, DSInsertRequest.DS_INSERT, collectionName) || this;
        _this.data = data;
        return _this;
    }
    DSInsertRequest.dispatch = function (collectionName, data, dispatcher) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mesh_1.readAll(dispatcher.dispatch(new DSInsertRequest(collectionName, data)))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return DSInsertRequest;
}(DSMessage));
DSInsertRequest.DS_INSERT = "dsInsert";
exports.DSInsertRequest = DSInsertRequest;
// @serializable("DSUpdateRequest")
var DSUpdateRequest = (function (_super) {
    __extends(DSUpdateRequest, _super);
    function DSUpdateRequest(collectionName, data, query) {
        var _this = _super.call(this, DSUpdateRequest.DS_UPDATE, collectionName) || this;
        _this.data = data;
        _this.query = query;
        return _this;
    }
    DSUpdateRequest.dispatch = function (collectionName, data, query, dispatch) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mesh_1.readAll(dispatcher.dispatch(new DSUpdateRequest(collectionName, data, query)))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return DSUpdateRequest;
}(DSMessage));
DSUpdateRequest.DS_UPDATE = "dsUpdate";
exports.DSUpdateRequest = DSUpdateRequest;
// @serializable("DSFindRequest")
var DSFindRequest = (function (_super) {
    __extends(DSFindRequest, _super);
    function DSFindRequest(collectionName, query, multi) {
        if (multi === void 0) { multi = false; }
        var _this = _super.call(this, DSFindRequest.DS_FIND, collectionName) || this;
        _this.query = query;
        _this.multi = multi;
        return _this;
    }
    DSFindRequest.createFilter = function (collectionName) {
        return sift_1.default({ collectionName: collectionName });
    };
    DSFindRequest.findOne = function (collectionName, query, dispatcher) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readOneChunk(dispatcher.dispatch(new DSFindRequest(collectionName, query, true)))];
                    case 1: return [2 /*return*/, (_a.sent()).value];
                }
            });
        });
    };
    DSFindRequest.findMulti = function (collectionName, query, dispatcher) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mesh_1.readAll(dispatcher.dispatch(new DSFindRequest(collectionName, query, true)))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return DSFindRequest;
}(DSMessage));
DSFindRequest.DS_FIND = "dsFind";
exports.DSFindRequest = DSFindRequest;
// @serializable("DSTailRequest")
var DSTailRequest = (function (_super) {
    __extends(DSTailRequest, _super);
    function DSTailRequest(collectionName, query) {
        var _this = _super.call(this, DSTailRequest.DS_TAIL, collectionName) || this;
        _this.query = query;
        return _this;
    }
    DSTailRequest.dispatch = function (collectionName, query, dispatcher) {
        return dispatcher.dispatch(new DSTailRequest(collectionName, query));
    };
    return DSTailRequest;
}(DSMessage));
DSTailRequest.DS_TAIL = "dsTail";
exports.DSTailRequest = DSTailRequest;
// @serializable("DSTailedOperation")
var DSTailedOperation = (function () {
    function DSTailedOperation(request, data) {
        this.data = data;
        this.type = DSTailedOperation.DS_TAILED_OPERATION;
    }
    return DSTailedOperation;
}());
DSTailedOperation.DS_TAILED_OPERATION = "tsTailedOperation";
exports.DSTailedOperation = DSTailedOperation;
// @serializable("DSFindAllRequest")
var DSFindAllRequest = (function (_super) {
    __extends(DSFindAllRequest, _super);
    function DSFindAllRequest(collectionName) {
        return _super.call(this, collectionName, {}, true) || this;
    }
    return DSFindAllRequest;
}(DSFindRequest));
exports.DSFindAllRequest = DSFindAllRequest;
// @serializable("DSRemoveRequest")
var DSRemoveRequest = (function (_super) {
    __extends(DSRemoveRequest, _super);
    function DSRemoveRequest(collectionName, query) {
        var _this = _super.call(this, DSRemoveRequest.DS_REMOVE, collectionName) || this;
        _this.query = query;
        return _this;
    }
    return DSRemoveRequest;
}(DSMessage));
DSRemoveRequest.DS_REMOVE = "dsRemove";
exports.DSRemoveRequest = DSRemoveRequest;
//# sourceMappingURL=messages.js.map