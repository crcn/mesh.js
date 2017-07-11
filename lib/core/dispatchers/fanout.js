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
Object.defineProperty(exports, "__esModule", { value: true });
var streams_1 = require("../streams");
var utils_1 = require("../utils");
var FanoutBus = (function () {
    function FanoutBus(_dispatchers, _iterator) {
        this._dispatchers = _dispatchers;
        this._iterator = _iterator;
        this.getDispatchers = typeof _dispatchers === "function" ? _dispatchers : function () { return _dispatchers; };
    }
    FanoutBus.prototype.dispatch = function (message) {
        var _this = this;
        return new streams_1.DuplexStream(function (input, output) {
            var writer = output.getWriter();
            var spare = input, child;
            var pending = 0;
            _this._iterator(_this.getDispatchers(message), function (dispatcher) {
                var response = dispatcher.dispatch(message);
                if (response == null) {
                    return Promise.resolve();
                }
                _a = spare.tee(), spare = _a[0], child = _a[1];
                response = streams_1.wrapDuplexStream(response);
                pending++;
                return child
                    .pipeThrough(response)
                    .pipeTo(new streams_1.WritableStream({
                    write: function (chunk) {
                        return writer.write(chunk);
                    },
                    close: function () { return pending--; },
                    abort: function () { return pending--; }
                }));
                var _a;
            })
                .then(writer.close.bind(writer))
                .catch(writer.abort.bind(writer))
                .catch(function (e) { });
        });
    };
    return FanoutBus;
}());
exports.FanoutBus = FanoutBus;
var SequenceBus = (function (_super) {
    __extends(SequenceBus, _super);
    function SequenceBus(dispatchers) {
        return _super.call(this, dispatchers, utils_1.sequenceIterator) || this;
    }
    return SequenceBus;
}(FanoutBus));
exports.SequenceBus = SequenceBus;
var ParallelBus = (function (_super) {
    __extends(ParallelBus, _super);
    function ParallelBus(dispatchers) {
        return _super.call(this, dispatchers, utils_1.parallelIterator) || this;
    }
    return ParallelBus;
}(FanoutBus));
exports.ParallelBus = ParallelBus;
var RoundRobinBus = (function (_super) {
    __extends(RoundRobinBus, _super);
    function RoundRobinBus(dispatchers) {
        return _super.call(this, dispatchers, utils_1.createRoundRobinIterator()) || this;
    }
    return RoundRobinBus;
}(FanoutBus));
exports.RoundRobinBus = RoundRobinBus;
var RandomBus = (function (_super) {
    __extends(RandomBus, _super);
    function RandomBus(dispatchers, weights) {
        return _super.call(this, dispatchers, utils_1.createRandomIterator(weights)) || this;
    }
    return RandomBus;
}(FanoutBus));
exports.RandomBus = RandomBus;
//# sourceMappingURL=fanout.js.map