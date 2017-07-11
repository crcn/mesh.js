"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var noop_1 = require("./noop");
var streams_1 = require("../streams");
var FilterBus = (function () {
    function FilterBus(testMessage, _resolvedTarget, _rejectedTarget) {
        if (_resolvedTarget === void 0) { _resolvedTarget = noop_1.noopDispatcherInstance; }
        if (_rejectedTarget === void 0) { _rejectedTarget = noop_1.noopDispatcherInstance; }
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