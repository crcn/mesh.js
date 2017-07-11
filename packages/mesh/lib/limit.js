"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_1 = require("./proxy");
var sequence_1 = require("./sequence");
var queue_1 = require("./queue");
exports.limit = function (fn, max) {
    if (max === void 0) { max = 1; }
    var queue = queue_1.createQueue();
    var queueCount = 0;
    var next = function () {
        if (queueCount >= max) {
            return;
        }
        queueCount++;
        queue.unshift(sequence_1.sequence(fn, function () { return queueCount-- && next(); })).then(next);
    };
    next();
    return proxy_1.proxy(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return queue.next().then(function (_a) {
            var value = _a.value;
            return value;
        });
    });
};
//# sourceMappingURL=limit.js.map