"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var pump_1 = require("./pump");
var remote_1 = require("./remote");
var queue_1 = require("./queue");
var proxy_1 = require("./proxy");
var deferred_promise_1 = require("./deferred-promise");
/**
 * Creates a new messaging channel over an existing message stream.
 */
exports.inlet = function (iterable, call, info) {
    var q = queue_1.createQueue();
    return remote_1.remote(function () { return ({
        adapter: {
            send: function (message) {
                iterable.next(message).then(function (_a) {
                    var value = _a.value;
                    q.unshift(value);
                });
            },
            addListener: function (listener) {
                pump_1.pump(q, listener);
            }
        }
    }); }, call);
};
exports.outlet = function (createDownstream) {
    var input = queue_1.createQueue();
    var output = queue_1.createQueue();
    var _a = deferred_promise_1.createDeferredPromise(), promise = _a.promise, resolve = _a.resolve;
    var upstream = remote_1.remote(function () { return ({
        adapter: {
            send: function (message) {
                output.unshift(message);
            },
            addListener: function (listener) {
                pump_1.pump(input, listener);
            }
        }
    }); }, proxy_1.proxy(function () { return promise; }));
    resolve(createDownstream(upstream));
    return _b = {},
        _b[Symbol.asyncIterator] = function () { return _this; },
        _b.next = function (value) {
            input.unshift(value);
            return output.next();
        },
        _b;
    var _b;
};
//# sourceMappingURL=channel.js.map