"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DS_FIND = "DS_FIND";
exports.DS_INSERT = "DS_INSERT";
exports.DS_UPDATE = "DS_UPDATE";
exports.DS_REMOVE = "DS_REMOVE";
exports.DS_TAIL = "DS_TAIL";
exports.dsMessage = function (type, collectionName, props) {
    if (props === void 0) { props = {}; }
    return (__assign({}, props, { type: type,
        collectionName: collectionName, createdAt: Date.now() }));
};
exports.dSInsertRequest = function (collectionName, data) { return exports.dsMessage(exports.DS_INSERT, collectionName, {
    data: data
}); };
exports.dSUpdateRequest = function (collectionName, data, query) { return exports.dsMessage(exports.DS_UPDATE, collectionName, {
    data: data,
    query: query
}); };
exports.dSFindRequest = function (collectionName, query, multi) {
    if (multi === void 0) { multi = false; }
    return exports.dsMessage(exports.DS_FIND, collectionName, {
        query: query,
        multi: multi
    });
};
exports.dSFindAllRequest = function (collectionName) { return exports.dsMessage(exports.DS_FIND, collectionName, {
    query: {},
    multi: true
}); };
exports.dSRemoveRequest = function (collectionName, query, multi) {
    if (multi === void 0) { multi = false; }
    return exports.dsMessage(exports.DS_REMOVE, collectionName, {
        query: query,
        multi: multi
    });
};
exports.dSTailRequest = function (collectionName, query) { return exports.dsMessage(exports.DS_TAIL, collectionName, {
    query: query
}); };
//# sourceMappingURL=messages.js.map