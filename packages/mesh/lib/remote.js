"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pump_1 = require("./pump");
var proxy_1 = require("./proxy");
var duplex_1 = require("./duplex");
var queue_1 = require("./queue");
var wrap_async_iterable_iterator_1 = require("./wrap-async-iterable-iterator");
var deferred_promise_1 = require("./deferred-promise");
var noop = function () { };
var RemoteMessageType;
(function (RemoteMessageType) {
    RemoteMessageType[RemoteMessageType["CALL"] = 0] = "CALL";
    RemoteMessageType[RemoteMessageType["NEXT"] = 1] = "NEXT";
    RemoteMessageType[RemoteMessageType["YIELD"] = 2] = "YIELD";
    RemoteMessageType[RemoteMessageType["RETURN"] = 3] = "RETURN";
})(RemoteMessageType || (RemoteMessageType = {}));
var fill0 = function (num, min) {
    if (min === void 0) { min = 2; }
    var buffer = "" + num;
    while (buffer.length < min) {
        buffer = "0" + buffer;
    }
    return buffer;
};
var seed = fill0(Math.round(Math.random() * 100), 3);
var _i = 0;
var createUID = function () {
    var now = new Date();
    return "" + seed + fill0(now.getSeconds()) + _i++;
};
var PASSED_THROUGH_KEY = "$$passedThrough";
var createRemoteMessage = function (type, sid, did, payload) { return ({ type: type, sid: sid, did: did, payload: payload }); };
/**
 * Remote message me this ´doSomething´
 */
exports.remote = function (getOptions, call) {
    if (call === void 0) { call = noop; }
    var _a = deferred_promise_1.createDeferredPromise(), remotePromise = _a.promise, resolveRemote = _a.resolve;
    Promise.resolve(getOptions()).then(function (_a) {
        var adapter = _a.adapter, _b = _a.info, info = _b === void 0 ? {} : _b;
        var uid = createUID();
        var dests = {};
        var connections = new Map();
        var promises = new Map();
        var messageQueue = queue_1.createQueue();
        var shouldCall = function () {
            var args = [];
            for (var _a = 0; _a < arguments.length; _a++) {
                args[_a] = arguments[_a];
            }
            return args.some(function (arg) {
                if (typeof arg === "object") {
                    var passedThrough = Reflect.getMetadata(PASSED_THROUGH_KEY, arg) || [];
                    if (passedThrough.indexOf(uid) !== -1) {
                        return false;
                    }
                    Reflect.defineMetadata(PASSED_THROUGH_KEY, passedThrough.concat([uid]), arg);
                }
                return true;
            });
        };
        var getConnection = function (uid, each) {
            var connection = connections.get(uid);
            if (connection) {
                each(connection);
            }
        };
        var onCall = function (_a) {
            var sid = _a.sid, _b = _a.payload, info = _b[0], cid = _b[1], args = _b.slice(2);
            if (shouldCall.apply(void 0, args)) {
                connections.set(cid, wrap_async_iterable_iterator_1.wrapAsyncIterableIterator(call.apply(void 0, args)));
                adapter.send(createRemoteMessage(RemoteMessageType.YIELD, uid, sid, [cid, [uid, info]]));
            }
        };
        var onNext = function (_a) {
            var sid = _a.sid, did = _a.did, _b = _a.payload, pid = _b[0], cid = _b[1], value = _b[2];
            if (uid === did) {
                getConnection(cid, function (connection) { return connection.next(value).then(function (chunk) {
                    if (chunk.done) {
                        connections.delete(cid);
                    }
                    adapter.send(createRemoteMessage(RemoteMessageType.YIELD, uid, sid, [pid, chunk]));
                }); });
            }
        };
        var onYield = function (_a) {
            var sid = _a.sid, did = _a.did, _b = _a.payload, pid = _b[0], chunk = _b[1];
            if (uid === did && promises.has(pid)) {
                promises.get(pid).resolve(chunk);
                promises.delete(pid);
            }
        };
        var onReturn = function (_a) {
            var sid = _a.sid, did = _a.did, _b = _a.payload, pid = _b[0], cid = _b[1], value = _b[2];
            if (uid === did) {
                getConnection(cid, function (connection) { return connection.return(value).then(function (chunk) {
                    if (chunk.done) {
                        connections.delete(cid);
                    }
                    adapter.send(createRemoteMessage(RemoteMessageType.YIELD, uid, sid, [pid, chunk]));
                }); });
            }
        };
        var onResponse = function (_a) {
            var sid = _a.sid, did = _a.did, payload = _a.payload;
            if (promises.has(did)) {
                promises.get(did).resolve(payload);
            }
        };
        // throw incomming messages into a queue so that each gets handled in order, preventing
        // race conditions
        adapter.addListener(function (message) { return messageQueue.unshift(message); });
        // handle incomming messages
        pump_1.pump(messageQueue, function (message) {
            switch (message.type) {
                case RemoteMessageType.CALL: return onCall(message);
                case RemoteMessageType.NEXT: return onNext(message);
                case RemoteMessageType.YIELD: return onYield(message);
                case RemoteMessageType.RETURN: return onReturn(message);
            }
        });
        resolveRemote(function () {
            var args = [];
            for (var _a = 0; _a < arguments.length; _a++) {
                args[_a] = arguments[_a];
            }
            return duplex_1.createDuplex(function (input, output) {
                var cid = createUID();
                var cpom = deferred_promise_1.createDeferredPromise();
                var pumpRemoteCall = function (did, info) {
                    pump_1.pump(input, function (value) {
                        var pid = createUID();
                        var pom = deferred_promise_1.createDeferredPromise();
                        promises.set(pid, pom);
                        return new Promise(function (resolve, reject) {
                            pom.promise.then(function (_a) {
                                var value = _a.value, done = _a.done;
                                promises.delete(pid);
                                if (done) {
                                    output.return();
                                    resolve();
                                }
                                else {
                                    output.unshift(value);
                                    resolve();
                                }
                            });
                            adapter.send(createRemoteMessage(RemoteMessageType.NEXT, uid, did, [pid, cid, value]));
                        });
                    }).then(function (value) {
                        var pid = createUID();
                        var pom = deferred_promise_1.createDeferredPromise();
                        promises.set(pid, pom);
                        pom.promise.then(output.return);
                        adapter.send(createRemoteMessage(RemoteMessageType.RETURN, uid, did, [pid, cid, value]));
                    });
                };
                var waitForResponse = function () {
                    var cpom = deferred_promise_1.createDeferredPromise();
                    promises.delete(cid);
                    promises.set(cid, cpom);
                    cpom.promise.then(function (_a) {
                        var dest = _a[0], info = _a[1];
                        waitForResponse();
                        pumpRemoteCall(dest, info);
                    });
                };
                if (shouldCall.apply(void 0, args)) {
                    waitForResponse();
                    adapter.send(createRemoteMessage(RemoteMessageType.CALL, uid, null, [info, cid].concat(args)));
                }
                else {
                    output.return();
                }
            });
        });
    });
    return proxy_1.proxy(function () { return remotePromise; });
};
//# sourceMappingURL=remote.js.map