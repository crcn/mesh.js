"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function wrapPromise(value) {
    if (value && value["then"])
        return value;
    return Promise.resolve(value);
}
exports.wrapPromise = wrapPromise;
//# sourceMappingURL=wrap-promise.js.map