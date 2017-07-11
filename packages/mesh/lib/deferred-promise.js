"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeferredPromise = function () {
    var resolve;
    var reject;
    var promise;
    promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });
    return {
        promise: promise,
        resolve: resolve,
        reject: reject,
    };
};
//# sourceMappingURL=deferred-promise.js.map