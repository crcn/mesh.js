"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tee_1 = require("./tee");
var pump_1 = require("./pump");
var duplex_1 = require("./duplex");
var wrap_async_iterable_iterator_1 = require("./wrap-async-iterable-iterator");
/**
 * Calls all target functions in parallel, and returns the yielded values of the _fastest_ one.
 *
 * @example
 *
 * const ping = race(
 *
 * );
 */
exports.race = function () {
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
            var primaryInput = input;
            var wonFn;
            fns.forEach(function (fn, i) {
                var spareInput;
                _a = tee_1.tee(primaryInput), spareInput = _a[0], primaryInput = _a[1];
                var iter = wrap_async_iterable_iterator_1.wrapAsyncIterableIterator(fn.apply(void 0, args));
                pump_1.pump(spareInput, function (value) {
                    return iter.next(value).then(function (_a) {
                        var value = _a.value, done = _a.done;
                        if (wonFn && wonFn !== fn) {
                            return;
                        }
                        wonFn = fn;
                        if (done) {
                            output.return();
                        }
                        else {
                            output.unshift(value);
                        }
                    });
                }).then(function () {
                    if (wonFn === fn) {
                        output.return();
                    }
                });
                var _a;
            });
        });
    };
};
//# sourceMappingURL=race.js.map