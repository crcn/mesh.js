"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * No-operation bus.
 */
var NoopBus = (function () {
    function NoopBus() {
    }
    NoopBus.prototype.dispatch = function (message) { };
    return NoopBus;
}());
exports.NoopBus = NoopBus;
exports.noopBusInstance = new NoopBus();
//# sourceMappingURL=noop.js.map