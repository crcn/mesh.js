"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var wrap_async_iterable_iterator_1 = require("./wrap-async-iterable-iterator");
var TIMEOUT = 1000 * 115; // default TTL specified by some browsers
var createDefaultError = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new Error("Timeout calling function.");
};
exports.timeout = function (fn, ms, createError) {
    if (ms === void 0) { ms = TIMEOUT; }
    if (createError === void 0) { createError = createDefaultError; }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _completed;
        var _timeout;
        var _error;
        var resetTimeout = function () {
            clearTimeout(_timeout);
            _timeout = setTimeout(function () {
                _error = createError.apply(void 0, args);
            }, ms);
        };
        resetTimeout();
        var iter = wrap_async_iterable_iterator_1.wrapAsyncIterableIterator(fn.apply(void 0, args));
        return _a = {},
            _a[Symbol.asyncIterator] = function () { return _this; },
            _a.next = function (value) {
                if (_error) {
                    return Promise.reject(_error);
                }
                resetTimeout();
                return iter.next(value).then(function (result) {
                    if (_error)
                        return Promise.reject(_error);
                    resetTimeout();
                    if (result.done) {
                        clearTimeout(_timeout);
                    }
                    return result;
                });
            },
            _a;
        var _a;
    };
};
//# sourceMappingURL=timeout.js.map