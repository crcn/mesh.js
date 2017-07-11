"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeout = function (ms) {
    if (ms === void 0) { ms = 0; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
//# sourceMappingURL=index.js.map