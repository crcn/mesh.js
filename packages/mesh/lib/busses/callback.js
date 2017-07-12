"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CallbackBus = (function () {
    function CallbackBus(callback) {
        this.callback = callback;
    }
    CallbackBus.prototype.dispatch = function (message) {
        return this.callback(message);
    };
    return CallbackBus;
}());
exports.CallbackBus = CallbackBus;
exports.createCallbackBus = function (callback) { return new CallbackBus(callback); };
//# sourceMappingURL=callback.js.map