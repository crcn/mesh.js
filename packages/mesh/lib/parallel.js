"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var combine_1 = require("./combine");
/**
 * Executes a message against all target functions at the same time.
 */
exports.parallel = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return combine_1.combine(fns, function (items, each) {
        return Promise.all(items.map(each));
    });
};
//# sourceMappingURL=parallel.js.map