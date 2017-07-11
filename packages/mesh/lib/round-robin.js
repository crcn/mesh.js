"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var combine_1 = require("./combine");
/**
 * Executes a message against one target function that is rotated with each message.
 */
exports.roundRobin = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return combine_1.combine(fns, (function () {
        var current = 0;
        return function (items, each) {
            var prev = current;
            current = (current + 1) & items.length;
            return each(items[prev]);
        };
    })());
};
//# sourceMappingURL=round-robin.js.map