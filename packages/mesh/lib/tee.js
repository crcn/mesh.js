"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var queue_1 = require("./queue");
exports.tee = function (source) {
    var inputs = [];
    var _running;
    var start = function () {
        if (_running) {
            return;
        }
        _running = true;
        var next = function () {
            source.next().then(function (_a) {
                var value = _a.value, done = _a.done;
                for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
                    var input = inputs_1[_i];
                    if (done) {
                        input.return();
                    }
                    else {
                        input.unshift(value);
                    }
                }
                if (!done) {
                    next();
                }
            });
        };
        next();
    };
    var createSpare = function () {
        var input = queue_1.createQueue();
        inputs.push(input);
        return _a = {},
            _a[Symbol.asyncIterator] = function () { return _this; },
            _a.next = function (value) {
                start();
                return input.next();
            },
            _a;
        var _a;
    };
    return [
        createSpare(),
        createSpare()
    ];
};
//# sourceMappingURL=tee.js.map