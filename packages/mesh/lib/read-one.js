"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wrap_async_iterable_iterator_1 = require("./wrap-async-iterable-iterator");
exports.readOne = function (value, ret) { return new Promise(function (resolve, reject) {
    var iterable = wrap_async_iterable_iterator_1.wrapAsyncIterableIterator(value);
    iterable.next().then(function (_a) {
        var value = _a.value, done = _a.done;
        resolve(value);
        if (ret !== false) {
            iterable.return();
        }
    }, reject);
}); };
//# sourceMappingURL=read-one.js.map