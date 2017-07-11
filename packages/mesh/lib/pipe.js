"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wrap_async_iterable_iterator_1 = require("./wrap-async-iterable-iterator");
function pipe() {
    var _this = this;
    var pipeline = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        pipeline[_i] = arguments[_i];
    }
    var _done = false;
    var targets = pipeline.map(wrap_async_iterable_iterator_1.wrapAsyncIterableIterator);
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