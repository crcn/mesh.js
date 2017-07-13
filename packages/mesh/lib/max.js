"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wrap_async_iterable_iterator_1 = require("./wrap-async-iterable-iterator");
exports.max = function (fn, count) {
    if (count === void 0) { count = 1; }
    var _numCalls = 0;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return ++_numCalls > count ? wrap_async_iterable_iterator_1.wrapAsyncIterableIterator(undefined) : fn.apply(void 0, args);
    };
};
//# sourceMappingURL=max.js.map