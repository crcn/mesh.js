"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var noReturn = function () { return Promise.resolve({ done: true }); };
var noThrow = noReturn;
function wrapAsyncIterableIterator(source) {
    var _this = this;
    if (source != null && typeof source === "object") {
        if (source[Symbol.asyncIterator]) {
            return _a = {},
                _a[Symbol.asyncIterator] = function () { return _this; },
                _a.next = source.next,
                _a.return = source.return ? source.return : noReturn,
                _a.throw = source.throw ? source.throw : noThrow,
                _a;
        }
        if (source[Symbol.iterator]) {
            var iterator_1 = source[Symbol.iterator]();
            return _b = {},
                _b[Symbol.asyncIterator] = function () {
                    return this;
                },
                _b.next = function (value) {
                    var v;
                    try {
                        v = iterator_1.next(value);
                    }
                    catch (e) {
                        return Promise.reject(e);
                    }
                    return Promise.resolve(v);
                },
                _b.return = source.return ? function (value) {
                    return Promise.resolve(iterator_1.return(value));
                } : noReturn,
                _b.throw = source.throw ? function (error) {
                    return Promise.reject(iterator_1.throw(error));
                } : noThrow,
                _b;
        }
    }
    var result = typeof source === "object" && source != null && !!source.then ? source.then(function (result) { return Promise.resolve({ value: result, done: false }); }) : Promise.resolve({ value: source, done: source == null });
    var nexted = false;
    return _c = {},
        _c[Symbol.asyncIterator] = function () {
            return this;
        },
        _c.next = function () {
            if (nexted)
                return Promise.resolve({ value: undefined, done: true });
            nexted = true;
            return result;
        },
        _c.return = function () { return Promise.resolve({ done: true }); },
        _c.throw = function (e) { return Promise.reject(e); },
        _c;
    var _a, _b, _c;
}
exports.wrapAsyncIterableIterator = wrapAsyncIterableIterator;
//# sourceMappingURL=wrap-async-iterable-iterator.js.map