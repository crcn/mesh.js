"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var streams_1 = require("../streams");
var base_1 = require("./base");
/**
 * proxies a target bus, and queues messages
 * if there is none until there is
 */
var ProxyBus = (function () {
    function ProxyBus(_target) {
        this._target = _target;
        this._queue = [];
    }
    ProxyBus.prototype.testMessage = function (message) {
        return base_1.testDispatcherMessage(this._target, message);
    };
    ProxyBus.prototype.dispatch = function (message) {
        var _this = this;
        // no target? put the message in a queue until there is
        if (this.paused) {
            return new streams_1.DuplexStream(function (input, output) {
                _this._queue.push({ message: message, input: input, output: output });
            });
        }
        return streams_1.wrapDuplexStream(this.target.dispatch(message));
    };
    Object.defineProperty(ProxyBus.prototype, "paused", {
        get: function () {
            return this._paused || !this._target;
        },
        enumerable: true,
        configurable: true
    });
    ProxyBus.prototype.pause = function () {
        this._paused = true;
    };
    ProxyBus.prototype.resume = function () {
        this._paused = false;
        this._drain();
    };
    Object.defineProperty(ProxyBus.prototype, "target", {
        get: function () {
            return this._target;
        },
        set: function (value) {
            this._target = value;
            // try draining the proxy now.
            this._drain();
        },
        enumerable: true,
        configurable: true
    });
    ProxyBus.prototype._drain = function () {
        if (this.paused)
            return;
        var queue = this._queue.concat();
        this._queue = [];
        while (queue.length) {
            var _a = queue.shift(), input = _a.input, output = _a.output, message = _a.message;
            streams_1.wrapDuplexStream(this.target.dispatch(message)).readable.pipeTo(output);
        }
    };
    return ProxyBus;
}());
exports.ProxyBus = ProxyBus;
//# sourceMappingURL=proxy.js.map