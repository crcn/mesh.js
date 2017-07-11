"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var queue_1 = require("./queue");
exports.createDuplexStream = function (handler) {
    var input = queue_1.createQueue();
    var output = queue_1.createQueue();
    var running;
    var start = function () {
        if (running) {
            return;
        }
        running = true;
        handler(input, output);
    };
    return _a = {},
        _a[Symbol.asyncIterator] = function () { return _this; },
        _a.next = function (value) {
            start();
            input.unshift(value);
            return output.next();
        },
        _a;
    var _a;
};
//# sourceMappingURL=duplex-stream.js.map