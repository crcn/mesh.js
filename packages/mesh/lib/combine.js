"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tee_1 = require("./tee");
var duplex_1 = require("./duplex");
var wrap_async_iterable_iterator_1 = require("./wrap-async-iterable-iterator");
exports.combine = function (fns, iterator) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return duplex_1.createDuplex(function (input, output) {
        var primaryInput = input;
        var inputs = Array.from({ length: fns.length }).map(function (v) {
            var input;
            _a = tee_1.tee(primaryInput), input = _a[0], primaryInput = _a[1];
            return input;
            var _a;
        });
        var pending = [];
        var returnPending = function (value) {
            for (var _i = 0, pending_1 = pending; _i < pending_1.length; _i++) {
                var iter = pending_1[_i];
                iter.return(value);
            }
        };
        iterator(fns, function (call) {
            var index = fns.indexOf(call);
            var input = inputs[index];
            var iter = wrap_async_iterable_iterator_1.wrapAsyncIterableIterator(call.apply(void 0, args));
            pending.push(iter);
            var next = function () {
                return input.next().then(function (_a) {
                    var value = _a.value, done = _a.done;
                    if (done) {
                        returnPending(value);
                        return;
                    }
                    return iter.next(value).then(function (_a) {
                        var value = _a.value, done = _a.done;
                        if (done) {
                            pending.splice(pending.indexOf(iter), 1);
                            return;
                        }
                        else {
                            return output.unshift(value).then(next);
                        }
                    });
                });
            };
            return next();
        }).then(output.return, output.throw);
    });
}; };
//# sourceMappingURL=combine.js.map