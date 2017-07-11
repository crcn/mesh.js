"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wrap_promise_1 = require("./wrap-promise");
var duplex_1 = require("./duplex");
var wrap_async_iterable_iterator_1 = require("./wrap-async-iterable-iterator");
exports.proxy = function (getFn) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return duplex_1.createDuplex(function (input, output) {
        wrap_promise_1.wrapPromise(getFn.apply(void 0, args)).then(function (fn) {
            var iter = wrap_async_iterable_iterator_1.wrapAsyncIterableIterator((fn || (function () { })).apply(void 0, args));
            var next = function () {
                input.next().then(function (_a) {
                    var value = _a.value, done = _a.done;
                    if (done) {
                        return iter.return(value).then(output.return);
                    }
                    iter.next(value).then(function (_a) {
                        var value = _a.value, done = _a.done;
                        if (done) {
                            output.return();
                        }
                        else {
                            output.unshift(value).then(next);
                        }
                    });
                });
            };
            next();
        });
    });
}; };
//# sourceMappingURL=proxy.js.map