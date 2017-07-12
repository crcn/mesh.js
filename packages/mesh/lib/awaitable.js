"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var read_all_1 = require("./read-all");
var wrap_async_iterable_iterator_1 = require("./wrap-async-iterable-iterator");
exports.awaitable = function (fn) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var iter = wrap_async_iterable_iterator_1.wrapAsyncIterableIterator(fn.apply(void 0, args));
    var _readingAll;
    var _readAll = function () {
        return _readingAll || (_readingAll = read_all_1.readAll(iter));
    };
    return _a = {},
        _a[Symbol.asyncIterator] = function () { return _this; },
        _a.then = function (resolve, reject) {
            return _readAll().then(resolve, reject);
        },
        _a.catch = function (reject) {
            return _readAll().catch(reject);
        },
        _a.next = iter.next,
        _a.return = iter.next,
        _a.throw = iter.throw,
        _a;
    var _a;
}; };
//# sourceMappingURL=awaitable.js.map