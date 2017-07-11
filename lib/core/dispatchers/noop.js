"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoopDispatcher = (function () {
    function NoopDispatcher() {
    }
    NoopDispatcher.prototype.dispatch = function (message) { };
    return NoopDispatcher;
}());
exports.NoopDispatcher = NoopDispatcher;
exports.noopDispatcherInstance = new NoopDispatcher();
//# sourceMappingURL=noop.js.map