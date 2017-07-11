"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pump_1 = require("./pump");
var duplex_1 = require("./duplex");
var wrap_async_iterable_iterator_1 = require("./wrap-async-iterable-iterator");
// TODO - possibly endOnNoInput
function through(fn, keepOpen) {
    if (keepOpen === void 0) { keepOpen = false; }
    return duplex_1.createDuplex(function (input, output) {
        var nextInput = function () {
            input.next().then(function (_a) {
                var value = _a.value;
                if (value == null) {
                    if (!keepOpen) {
                        return output.return();
                    }
                }
                return pump_1.pump(wrap_async_iterable_iterator_1.wrapAsyncIterableIterator(fn(value)), function (value) {
                    return output.unshift(value);
                }).then(nextInput);
            });
        };
        nextInput();
    });
}
exports.through = through;
//# sourceMappingURL=through.js.map