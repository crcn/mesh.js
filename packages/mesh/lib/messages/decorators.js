"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getMetadataKey = function (name) { return "message:" + name; };
exports.defineMessageMetadata = function (name, value) {
    return function (messageClass) {
        Reflect.defineMetadata(getMetadataKey(name), value, messageClass);
        return messageClass;
    };
};
exports.getMessageMetadata = function (name, message) {
    var key = getMetadataKey(name);
    return Reflect.getMetadata(key, message) || Reflect.getMetadata(key, message.constructor);
};
exports.setMessageTarget = function (family) {
    return exports.defineMessageMetadata("target", family);
};
exports.getMessageTarget = function (message) {
    return exports.getMessageMetadata("target", message);
};
exports.getMessageVisitors = function (message) {
    return exports.getMessageMetadata("visitors", message) || [];
};
exports.addMessageVisitor = function () {
    var families = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        families[_i] = arguments[_i];
    }
    return function (message) {
        Reflect.defineMetadata(getMetadataKey("visitors"), (exports.getMessageMetadata("visitors", message) || []).concat(families), message);
    };
};
//# sourceMappingURL=decorators.js.map