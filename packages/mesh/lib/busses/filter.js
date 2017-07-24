"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var noop_1 = require("./noop");
var streams_1 = require("../streams");
/**
 * Executes a message against target bus if filter returns true, otherwise execute a message against falsy bus is provided.
 */
var FilterBus = (function () {
    /**
     * constructor
     * @param testMessage message filter. if TRUE, then passes message to resolve bus. If FALSE, then passes to reject bus.
     * @param _resolvedTarget target bus when testMessage passes TRUE
     * @param _rejectedTarget target bus when testMessage passes FALSE. Noops if this isn't present.
     */
    function FilterBus(testMessage, _resolvedTarget, _rejectedTarget) {
        if (_resolvedTarget === void 0) { _resolvedTarget = noop_1.noopBusInstance; }
        if (_rejectedTarget === void 0) { _rejectedTarget = noop_1.noopBusInstance; }
        this.testMessage = testMessage;
        this._resolvedTarget = _resolvedTarget;
        this._rejectedTarget = _rejectedTarget;
    }
    FilterBus.prototype.dispatch = function (message) {
        return streams_1.wrapDuplexStream((this.testMessage(message) ? this._resolvedTarget : this._rejectedTarget).dispatch(message));
    };
    return FilterBus;
}());
exports.FilterBus = FilterBus;
//# sourceMappingURL=filter.js.map