"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_1 = require("./proxy");
var callback_1 = require("./callback");
var noop_1 = require("./noop");
var streams_1 = require("../streams");
var PASSED_THROUGH_KEY = "$$passedThrough";
var _messageCount = 0;
var RemoteBusMessage = (function () {
    function RemoteBusMessage(type, source, dest, payload) {
        this.type = type;
        this.source = source;
        this.dest = dest;
        this.payload = payload;
        this.messageId = String(_messageCount++);
    }
    RemoteBusMessage.prototype.serialize = function (serializer) {
        return [this.type, this.messageId, this.source, this.dest, serializer.serialize(this.payload)];
    };
    RemoteBusMessage.deserialize = function (_a, serializer) {
        var type = _a[0], messageId = _a[1], source = _a[2], dests = _a[3], payload = _a[4];
        var message = new RemoteBusMessage(type, source, dests, serializer.deserialize(payload));
        message.messageId = messageId;
        return message;
    };
    return RemoteBusMessage;
}());
RemoteBusMessage.HELLO = 0;
RemoteBusMessage.DISPATCH = RemoteBusMessage.HELLO + 1;
RemoteBusMessage.RESPONSE = RemoteBusMessage.DISPATCH + 1;
RemoteBusMessage.CHUNK = RemoteBusMessage.RESPONSE + 1;
RemoteBusMessage.RESOLVE = RemoteBusMessage.CHUNK + 1;
RemoteBusMessage.REJECT = RemoteBusMessage.RESOLVE + 1;
RemoteBusMessage.CLOSE = RemoteBusMessage.REJECT + 1;
RemoteBusMessage.ABORT = RemoteBusMessage.CLOSE + 1;
exports.RemoteBusMessage = RemoteBusMessage;
var seed = fill0(Math.round(Math.random() * 100), 3);
var _i = 0;
var createUID = function () {
    var now = new Date();
    return "" + seed + fill0(now.getSeconds()) + _i++;
};
function fill0(num, min) {
    if (min === void 0) { min = 2; }
    var buffer = "" + num;
    while (buffer.length < min) {
        buffer = "0" + buffer;
    }
    return buffer;
}
var RemoteConnection = (function () {
    function RemoteConnection(uid, adapter, _serializer, _onClose) {
        this.uid = uid;
        this.adapter = adapter;
        this._serializer = _serializer;
        this._onClose = _onClose;
        this._dests = [];
        this._pendingPromises = new Map();
    }
    RemoteConnection.prototype.addDest = function (dest) {
        var _this = this;
        if (this._dests.indexOf(dest) !== -1)
            return;
        this._dests.push(dest);
        var _a = this._spare.tee(), spare = _a[0], child = _a[1];
        this._spare = spare;
        child.pipeTo(new streams_1.WritableStream({
            write: function (chunk) {
                return _this.send(new RemoteBusMessage(RemoteBusMessage.CHUNK, _this.uid, dest, chunk));
            },
            close: function () {
                _this._closed = true;
                return _this.send(new RemoteBusMessage(RemoteBusMessage.CLOSE, _this.uid, dest));
            },
            abort: function (reason) {
                return _this.send(new RemoteBusMessage(RemoteBusMessage.ABORT, _this.uid, dest, reason));
            },
        })).catch(function (e) {
            _this.send(new RemoteBusMessage(RemoteBusMessage.ABORT, _this.uid, dest, e));
        }).then(function () {
            _this._onClose();
        });
    };
    RemoteConnection.prototype.start = function (readable, writable) {
        this._spare = readable;
        this.writer = writable.getWriter();
    };
    RemoteConnection.prototype.close = function (dest) {
        var i = this._dests.indexOf(dest);
        if (~i) {
            this._dests.splice(i, 1);
        }
        else {
            return;
        }
        if (this._dests.length)
            return Promise.resolve();
        return this.writer.close();
    };
    RemoteConnection.prototype.write = function (chunk) {
        return this.writer.write(chunk);
    };
    RemoteConnection.prototype.abort = function (error) {
        return this.writer.abort(error);
    };
    RemoteConnection.prototype.send = function (message) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._pendingPromises.set(message.messageId + message.dest, [resolve, reject]);
            _this.adapter.send(message.serialize(_this._serializer));
        });
    };
    RemoteConnection.prototype.resolve = function (_a) {
        var pendingPromiseId = _a[0], value = _a[1];
        var pendingPromise = this._pendingPromises.get(pendingPromiseId);
        if (pendingPromise) {
            this._pendingPromises.delete(pendingPromiseId);
            pendingPromise[0](value);
        }
    };
    RemoteConnection.prototype.reject = function (_a) {
        var pendingPromiseId = _a[0], value = _a[1];
        var pendingPromise = this._pendingPromises.get(pendingPromiseId);
        if (pendingPromise) {
            this._pendingPromises.delete(pendingPromiseId);
            pendingPromise[1](value);
        }
    };
    return RemoteConnection;
}());
var RemoteBus = (function () {
    function RemoteBus(_a, _localDispatcher, _serializer) {
        var adapter = _a.adapter, family = _a.family, testMessage = _a.testMessage;
        if (_localDispatcher === void 0) { _localDispatcher = noop_1.noopDispatcherInstance; }
        this._localDispatcher = _localDispatcher;
        this._serializer = _serializer;
        this._pendingConnections = new Map();
        this.adapter = adapter;
        this._family = family;
        this._uid = createUID();
        if (!_serializer) {
            this._serializer = {
                serialize: function (o) { return o; },
                deserialize: function (i) { return i; }
            };
        }
        this._proxy = new proxy_1.ProxyBus(new callback_1.CallbackDispatcher(this._dispatchRemoteMessage.bind(this)));
        this._proxy.pause();
        this._testMessage = testMessage || (function (message) { return true; });
        this.adapter.addListener(this.onMessage.bind(this));
        this.greet(true);
    }
    RemoteBus.prototype.testMessage = function (message) {
        // return TRUE if dest family doesn't exist. Means that the handshake isn't finished yet.
        return !this._destFamily || this._testMessage(message, this._family, this._destFamily);
    };
    RemoteBus.prototype.dispose = function () {
        this._pendingConnections.forEach(function (pending) {
            pending.abort(new Error("disposed"));
        });
    };
    RemoteBus.prototype.greet = function (shouldSayHiBack) {
        this.adapter.send(new RemoteBusMessage(RemoteBusMessage.HELLO, null, null, [this._family, shouldSayHiBack]).serialize(this._serializer));
    };
    RemoteBus.prototype.onMessage = function (data) {
        var message;
        // some cases where the message is not deserializable - not always an issue, but
        // may break the remote bus.
        try {
            message = RemoteBusMessage.deserialize(data, this._serializer);
        }
        catch (e) {
            console.error(e.stack);
            return;
        }
        // TODO - check if origin is coming from self. Need to update tests for this
        if (message.type === RemoteBusMessage.DISPATCH) {
            this.onDispatch(message);
        }
        else if (message.type === RemoteBusMessage.RESPONSE) {
            this.onResponse(message);
        }
        else if (message.type === RemoteBusMessage.CHUNK) {
            this.onChunk(message);
        }
        else if (message.type === RemoteBusMessage.CLOSE) {
            this.onClose(message);
        }
        else if (message.type === RemoteBusMessage.ABORT) {
            this.onAbort(message);
        }
        else if (message.type === RemoteBusMessage.RESOLVE) {
            this.onResolve(message);
        }
        else if (message.type === RemoteBusMessage.REJECT) {
            this.onReject(message);
        }
        else if (message.type === RemoteBusMessage.HELLO) {
            this.onHello(message);
        }
    };
    RemoteBus.prototype.onResolve = function (_a) {
        var source = _a.source, dest = _a.dest, payload = _a.payload;
        var result = payload;
        this._getConnection(dest, function (con, uid) { return con.resolve(result); });
    };
    RemoteBus.prototype.onHello = function (_a) {
        var _b = _a.payload, family = _b[0], shouldSayHiBack = _b[1];
        this._destFamily = family;
        if (shouldSayHiBack)
            this.greet();
        this._proxy.resume();
    };
    RemoteBus.prototype.onReject = function (_a) {
        var source = _a.source, dest = _a.dest, payload = _a.payload;
        var reason = payload;
        this._getConnection(dest, function (con, uid) { return con.reject(reason); });
    };
    RemoteBus.prototype.resolve = function (messageId, source, dest, result) {
        this.adapter.send(new RemoteBusMessage(RemoteBusMessage.RESOLVE, source, dest, [messageId + source, result]).serialize(this._serializer));
    };
    RemoteBus.prototype.reject = function (messageId, source, dest, reason) {
        this.adapter.send(new RemoteBusMessage(RemoteBusMessage.REJECT, source, dest, [messageId + source, reason]).serialize(this._serializer));
    };
    RemoteBus.prototype.onChunk = function (_a) {
        var _this = this;
        var messageId = _a.messageId, source = _a.source, dest = _a.dest, payload = _a.payload;
        this._getConnection(dest, function (con, uid) {
            _this.respond(con.write(payload), messageId, uid, source);
        });
    };
    RemoteBus.prototype.onClose = function (_a) {
        var _this = this;
        var messageId = _a.messageId, source = _a.source, dest = _a.dest, payload = _a.payload;
        this._getConnection(dest, function (con, uid) { return _this.respond(con.close(source), messageId, uid, source); });
    };
    RemoteBus.prototype.respond = function (promise, messageId, source, dest) {
        promise.then(this.resolve.bind(this, messageId, source, dest)).catch(this.reject.bind(this, messageId, source, dest));
    };
    RemoteBus.prototype.onAbort = function (_a) {
        var _this = this;
        var messageId = _a.messageId, source = _a.source, dest = _a.dest, payload = _a.payload;
        this._getConnection(dest, function (con, uid) { return _this.respond(con.abort(payload), messageId, uid, source); });
    };
    RemoteBus.prototype.onDispatch = function (_a) {
        var _this = this;
        var payload = _a.payload, source = _a.source, dest = _a.dest;
        var targetDispatcher = this._shouldHandleMessage(payload) ? this._localDispatcher : noop_1.noopDispatcherInstance;
        var con = new RemoteConnection(createUID(), this.adapter, this._serializer, function () {
            _this._pendingConnections.delete(con.uid);
        });
        this._pendingConnections.set(con.uid, con);
        var _b = streams_1.wrapDuplexStream(targetDispatcher.dispatch(payload)), readable = _b.readable, writable = _b.writable;
        con.start(readable, writable);
        this.adapter.send(new RemoteBusMessage(RemoteBusMessage.RESPONSE, con.uid, source).serialize(this._serializer));
        con.addDest(source);
    };
    RemoteBus.prototype.onResponse = function (_a) {
        var source = _a.source, dest = _a.dest;
        this._getConnection(dest, function (con, uid) { return con.addDest(source); });
    };
    RemoteBus.prototype._getConnection = function (uid, each) {
        var con = this._pendingConnections.get(uid);
        if (con)
            each(con, uid);
    };
    RemoteBus.prototype._shouldHandleMessage = function (message) {
        if (!message[PASSED_THROUGH_KEY]) {
            message[PASSED_THROUGH_KEY] = {};
        }
        if (message[PASSED_THROUGH_KEY][this._uid])
            return false;
        return message[PASSED_THROUGH_KEY][this._uid] = true;
    };
    RemoteBus.prototype.dispatch = function (message) {
        return this._proxy.dispatch(message);
    };
    RemoteBus.prototype._dispatchRemoteMessage = function (message) {
        var _this = this;
        return new streams_1.DuplexStream(function (input, output) {
            if (!_this._shouldHandleMessage(message) || !_this.testMessage(message)) {
                return output.getWriter().close();
            }
            var con = new RemoteConnection(createUID(), _this.adapter, _this._serializer, function () {
                _this._pendingConnections.delete(con.uid);
            });
            _this._pendingConnections.set(con.uid, con);
            con.start(input, output);
            _this.adapter.send(new RemoteBusMessage(RemoteBusMessage.DISPATCH, con.uid, null, message).serialize(_this._serializer));
        });
    };
    return RemoteBus;
}());
exports.RemoteBus = RemoteBus;
//# sourceMappingURL=remote.js.map