"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wrap_async_iterable_iterator_1 = require("./wrap-async-iterable-iterator");
/**
 * Pipes yielded data though each iterable in the pipeline
 *
 * @param {AsyncIterableIterator|IterableIterator} source the first iterable in the pipeline
 * @param {AsyncIterableIterator|IterableIterator} [through] proceeding iterables to pass yielded data through
 *
 * @example
 * import { pipe, through, readAll } from "mesh";
 *
 * const negate = (values) => pipe(
 *   values,
 *   through(a => -a)
 * );
 *
 * const negativeValues = await readAll(negate([1, 2, 3])); // [-1, -2, -3]
 *
 */
function pipe() {
    var _this = this;
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i] = arguments[_i];
    }
    var _done = false;
    var targets = items.map(wrap_async_iterable_iterator_1.wrapAsyncIterableIterator);
    var call = function (methodName, value) {
        return new Promise(function (resolve, reject) {
            var remaining = targets.concat();
            var next = function (_a) {
                var value = _a.value, done = _a.done;
                if (!_done) {
                    _done = done;
                }
                // if one piped item finishes, then we need to finish
                if (!remaining.length || _done) {
                    if (methodName === "next") {
                        while (remaining.length) {
                            (remaining.shift().return || (function () { }))();
                        }
                    }
                    return resolve({ value: value, done: done });
                }
                var fn = remaining.shift()[methodName];
                return fn ? fn(value).then(next, reject) : next(value);
            };
            next({ value: value, done: false });
        });
    };
    return _a = {},
        _a[Symbol.asyncIterator] = function () { return _this; },
        _a.next = call.bind(this, "next"),
        _a.return = call.bind(this, "return"),
        _a.throw = call.bind(this, "throw"),
        _a;
    var _a;
}
exports.pipe = pipe;
//# sourceMappingURL=pipe.js.map