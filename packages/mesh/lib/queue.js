"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueue = function () {
    var _pulling = [];
    var _pushing = [];
    var _e;
    var _done;
    var write = function (value, done) {
        if (done === void 0) { done = false; }
        return new Promise(function (resolve, reject) {
            if (_pulling.length) {
                _pulling.shift()[0]({ value: value, done: done });
                resolve();
            }
            else {
                _pushing.push(function () {
                    resolve();
                    return Promise.resolve({ value: value, done: done });
                });
            }
        });
    };
    return _a = {},
        _a[Symbol.asyncIterator] = function () {
            return this;
        },
        _a.next = function (value) {
            if (_e) {
                return Promise.reject(_e);
            }
            if (_pushing.length) {
                if (_done) {
                }
                return _pushing.shift()();
            }
            if (_done) {
                return Promise.resolve({ done: true });
            }
            return new Promise(function (resolve, reject) {
                _pulling.push([resolve, reject]);
            });
        },
        _a.unshift = function (value) {
            return write(value);
        },
        _a.return = function (returnValue) {
            if (_done) {
                return Promise.resolve({ done: true });
            }
            _done = true;
            return write(returnValue, true);
        },
        _a.throw = function (e) {
            _e = e;
            if (_pulling.length) {
                _pulling.shift()[1](e);
            }
            return Promise.resolve({ value: e, done: true });
        },
        _a;
    var _a;
};
//# sourceMappingURL=queue.js.map