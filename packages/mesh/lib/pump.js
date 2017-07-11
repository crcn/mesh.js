"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wrap_async_iterable_iterator_1 = require("./wrap-async-iterable-iterator");
var wrap_promise_1 = require("./wrap-promise");
function pump(source, each) {
    return new Promise(function (resolve, reject) {
        var iterable = wrap_async_iterable_iterator_1.wrapAsyncIterableIterator(source);
        var next = function () {
            iterable.next().then(function (_a) {
                var value = _a.value, done = _a.done;
                if (done)
                    return resolve(value);
                wrap_promise_1.wrapPromise(each(value)).then(next);
            }, reject);
        };
        next();
    });
}
exports.pump = pump;
//# sourceMappingURL=pump.js.map