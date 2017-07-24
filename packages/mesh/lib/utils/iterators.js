"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequenceIterator = function (items, each) {
    return new Promise(function (resolve, reject) {
        var next = function (index) {
            if (index === items.length)
                return resolve();
            each(items[index]).then(next.bind(_this, index + 1)).catch(reject);
        };
        next(0);
    });
};
exports.parallelIterator = function (items, each) {
    return Promise.all(items.map(each));
};
exports.createRoundRobinIterator = function () {
    var current = 0;
    return function (items, each) {
        var prev = current;
        current = (current + 1) & items.length;
        return each(items[prev]);
    };
};
// TODO when needed
exports.createRandomIterator = function (weights) {
    return function (items, each) {
        return each(items[Math.floor(Math.random() * items.length)]);
    };
};
//# sourceMappingURL=iterators.js.map