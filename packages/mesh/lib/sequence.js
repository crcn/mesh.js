"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var combine_1 = require("./combine");
/**
 * Executes functions in sequence
 *
 * @example
 *
 *
 * const ping = sequence(
 *  () => "pong1",
 *  () => "pong2"
 * );
 *
 * const iter = ping();
 * await iter.next(); // { value: "pong1", done: false }
 * await iter.next(); // { value: "pong2", done: false }
 * await iter.next(); // { value: undefined, done: true }
 */
exports.sequence = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return combine_1.combine(fns, function (items, each) {
        return new Promise(function (resolve, reject) {
            var next = function (index) {
                if (index === items.length)
                    return resolve();
                each(items[index]).then(next.bind(_this, index + 1)).catch(reject);
            };
            next(0);
        });
    });
};
//# sourceMappingURL=sequence.js.map