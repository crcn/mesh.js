"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pump_1 = require("./pump");
var duplex_1 = require("./duplex");
var wrap_async_iterable_iterator_1 = require("./wrap-async-iterable-iterator");
exports.fallback = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return duplex_1.createDuplex(function (input, output) {
            var targets = fns.concat();
            var buffer = [];
            var nextTarget = function () {
                var targetFn = targets.shift();
                if (!targetFn) {
                    return output.return();
                }
                var targetIter = wrap_async_iterable_iterator_1.wrapAsyncIterableIterator(targetFn.apply(void 0, args));
                var hasData = false;
                var next = function (value) {
                    return targetIter.next(value).then(function (_a) {
                        var value = _a.value, done = _a.done;
                        if (!hasData) {
                            hasData = !done;
                        }
                        if (hasData) {
                            if (done) {
                                output.return();
                            }
                            else {
                                output.unshift(value);
                            }
                        }
                        // if there is data, then use the current target, otherwise
                        // freeze with a promise that never resolves & move onto the next target
                        return hasData ? true : new Promise(function () {
                            nextTarget();
                        });
                    }, function (e) {
                        if (targets.length && !hasData) {
                            nextTarget();
                        }
                        else {
                            output.throw(e);
                        }
                    });
                };
                var pumpInput = function () {
                    return input.next().then(function (_a) {
                        var value = _a.value, done = _a.done;
                        if (done) {
                            return targetIter.return(value);
                        }
                        else {
                            buffer.push(value);
                            return next(value).then(pumpInput);
                        }
                    });
                };
                pump_1.pump(buffer, next).then(pumpInput);
            };
            nextTarget();
        });
    };
};
//# sourceMappingURL=fallback.js.map