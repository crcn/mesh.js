"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CallbackDispatcher = (function () {
    function CallbackDispatcher(callback) {
        this.callback = callback;
    }
    CallbackDispatcher.prototype.dispatch = function (message) {
        return this.callback(message);
    };
    return CallbackDispatcher;
}());
exports.CallbackDispatcher = CallbackDispatcher;
//# sourceMappingURL=callback.js.map