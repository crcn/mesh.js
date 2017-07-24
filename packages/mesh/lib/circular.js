"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_1 = require("./proxy");
var deferred_promise_1 = require("./deferred-promise");
exports.circular = function (create) { return function (downstream) {
    var _a = deferred_promise_1.createDeferredPromise(), upstreamPromise = _a.promise, resolveUpstreamDispatcher = _a.resolve;
    var top = create(proxy_1.proxy(function () { return upstreamPromise; }))(downstream);
    resolveUpstreamDispatcher(top);
    return top;
}; };
//# sourceMappingURL=circular.js.map