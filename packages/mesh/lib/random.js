"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var combine_1 = require("./combine");
var getFunctions = function (ops) { return ops.map(function (op) { return (typeof op === "function" ? op : op[1]); }); };
var getWeights = function (ops) { return ops.map(function (op) { return (typeof op === "function" ? 1 : op[0]); }); };
exports.random = function () {
    var ops = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ops[_i] = arguments[_i];
    }
    return combine_1.combine(getFunctions(ops), (function () {
        return function (items, each) {
            var weighted = [];
            var weights = getWeights(ops);
            if (weights) {
                var i = 0;
                var n = weights.length;
                for (; i < n; i++) {
                    var weight = weights[i];
                    for (var j = weight; j--;) {
                        weighted.push(items[i]);
                    }
                }
                weighted.push.apply(weighted, items.slice(i));
            }
            else {
                weighted.push.apply(weighted, items);
            }
            return each(weighted[Math.floor(Math.random() * weighted.length)]);
        };
    })());
};
//# sourceMappingURL=random.js.map