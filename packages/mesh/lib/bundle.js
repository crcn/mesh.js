var mesh = (function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var queue = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueue = function () {
    var _pulling = [];
    var _pushing = [];
    var _e;
    var _done;
    var write = function (value, done) {
        if (done === void 0) { done = false; }
        return new Promise(function (resolve, reject) {
            if (_pulling.length) {
                _pulling.shift()[0]({ value: value, done: done });
                resolve();
            }
            else {
                _pushing.push(function () {
                    resolve();
                    return Promise.resolve({ value: value, done: done });
                });
            }
        });
    };
    return _a = {},
        _a[Symbol.asyncIterator] = function () {
            return this;
        },
        _a.next = function (value) {
            if (_e) {
                return Promise.reject(_e);
            }
            if (_pushing.length) {
                if (_done) {
                }
                return _pushing.shift()();
            }
            if (_done) {
                return Promise.resolve({ done: true });
            }
            return new Promise(function (resolve, reject) {
                _pulling.push([resolve, reject]);
            });
        },
        _a.unshift = function (value) {
            return write(value);
        },
        _a.return = function (returnValue) {
            if (_done) {
                return Promise.resolve({ done: true });
            }
            _done = true;
            return write(returnValue, true);
        },
        _a.throw = function (e) {
            _e = e;
            if (_pulling.length) {
                _pulling.shift()[1](e);
            }
            return Promise.resolve({ value: e, done: true });
        },
        _a;
    var _a;
};

});

var tee = createCommonjsModule(function (module, exports) {
"use strict";
var _this = commonjsGlobal;
Object.defineProperty(exports, "__esModule", { value: true });

exports.tee = function (source) {
    var inputs = [];
    var _running;
    var start = function () {
        if (_running) {
            return;
        }
        _running = true;
        var next = function () {
            source.next().then(function (_a) {
                var value = _a.value, done = _a.done;
                for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
                    var input = inputs_1[_i];
                    if (done) {
                        input.return();
                    }
                    else {
                        input.unshift(value);
                    }
                }
                if (!done) {
                    next();
                }
            });
        };
        next();
    };
    var createSpare = function () {
        var input = queue.createQueue();
        inputs.push(input);
        return _a = {},
            _a[Symbol.asyncIterator] = function () { return _this; },
            _a.next = function (value) {
                start();
                return input.next();
            },
            _a;
        var _a;
    };
    return [
        createSpare(),
        createSpare()
    ];
};

});

var duplex = createCommonjsModule(function (module, exports) {
"use strict";
var _this = commonjsGlobal;
Object.defineProperty(exports, "__esModule", { value: true });

exports.createDuplex = function (handler) {
    var input = queue.createQueue();
    var output = queue.createQueue();
    var running;
    var start = function () {
        if (running) {
            return;
        }
        running = true;
        handler(input, output);
    };
    return _a = {},
        _a[Symbol.asyncIterator] = function () { return _this; },
        _a.next = function (value) {
            start();
            input.unshift(value);
            return output.next();
        },
        _a.return = function (value) {
            input.return(value);
            return output.next();
        },
        _a;
    var _a;
};

});

var wrapAsyncIterableIterator_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var noReturn = function () { return Promise.resolve({ done: true }); };
var noThrow = noReturn;
function wrapAsyncIterableIterator(source) {
    var _this = this;
    if (source != null && typeof source === "object") {
        if (source[Symbol.asyncIterator]) {
            return _a = {},
                _a[Symbol.asyncIterator] = function () { return _this; },
                _a.next = source.next,
                _a.return = source.return ? source.return : noReturn,
                _a.throw = source.throw ? source.throw : noThrow,
                _a;
        }
        if (source[Symbol.iterator]) {
            var iterator_1 = source[Symbol.iterator]();
            return _b = {},
                _b[Symbol.asyncIterator] = function () {
                    return this;
                },
                _b.next = function (value) {
                    var v;
                    try {
                        v = iterator_1.next(value);
                    }
                    catch (e) {
                        return Promise.reject(e);
                    }
                    return Promise.resolve(v);
                },
                _b.return = source.return ? function (value) {
                    return Promise.resolve(iterator_1.return(value));
                } : noReturn,
                _b.throw = source.throw ? function (error) {
                    return Promise.reject(iterator_1.throw(error));
                } : noThrow,
                _b;
        }
    }
    var result = typeof source === "object" && source != null && !!source.then ? source.then(function (result) { return Promise.resolve({ value: result, done: false }); }) : Promise.resolve({ value: source, done: source == null });
    var nexted = false;
    return _c = {},
        _c[Symbol.asyncIterator] = function () {
            return this;
        },
        _c.next = function () {
            if (nexted)
                return Promise.resolve({ value: undefined, done: true });
            nexted = true;
            return result;
        },
        _c.return = function () { return Promise.resolve({ done: true }); },
        _c.throw = function (e) { return Promise.reject(e); },
        _c;
    var _a, _b, _c;
}
exports.wrapAsyncIterableIterator = wrapAsyncIterableIterator;

});

var combine = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });



exports.combine = function (fns, iterator) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return duplex.createDuplex(function (input, output) {
        var primaryInput = input;
        var inputs = Array.from({ length: fns.length }).map(function (v) {
            var input;
            _a = tee.tee(primaryInput), input = _a[0], primaryInput = _a[1];
            return input;
            var _a;
        });
        var pending = [];
        var returnPending = function (value) {
            for (var _i = 0, pending_1 = pending; _i < pending_1.length; _i++) {
                var iter = pending_1[_i];
                iter.return(value);
            }
        };
        iterator(fns, function (call) {
            var index = fns.indexOf(call);
            var input = inputs[index];
            var iter = wrapAsyncIterableIterator_1.wrapAsyncIterableIterator(call.apply(void 0, args));
            pending.push(iter);
            var next = function () {
                return input.next().then(function (_a) {
                    var value = _a.value, done = _a.done;
                    if (done) {
                        returnPending(value);
                        return;
                    }
                    return iter.next(value).then(function (_a) {
                        var value = _a.value, done = _a.done;
                        if (done) {
                            pending.splice(pending.indexOf(iter), 1);
                            return;
                        }
                        else {
                            return output.unshift(value).then(next);
                        }
                    });
                });
            };
            return next();
        }).then(output.return, output.throw);
    });
}; };

});

var wrapPromise_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function wrapPromise(value) {
    if (value && value["then"])
        return value;
    return Promise.resolve(value);
}
exports.wrapPromise = wrapPromise;

});

var pump_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });


function pump(source, each) {
    return new Promise(function (resolve, reject) {
        var iterable = wrapAsyncIterableIterator_1.wrapAsyncIterableIterator(source);
        var next = function () {
            iterable.next().then(function (_a) {
                var value = _a.value, done = _a.done;
                if (done)
                    return resolve(value);
                wrapPromise_1.wrapPromise(each(value)).then(next);
            }, reject);
        };
        next();
    });
}
exports.pump = pump;

});

var proxy = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });



exports.proxy = function (getFn) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return duplex.createDuplex(function (input, output) {
        wrapPromise_1.wrapPromise(getFn.apply(void 0, args)).then(function (fn) {
            var iter = wrapAsyncIterableIterator_1.wrapAsyncIterableIterator((fn || (function () { })).apply(void 0, args));
            var next = function () {
                input.next().then(function (_a) {
                    var value = _a.value, done = _a.done;
                    if (done) {
                        return iter.return(value).then(output.return);
                    }
                    iter.next(value).then(function (_a) {
                        var value = _a.value, done = _a.done;
                        if (done) {
                            output.return();
                        }
                        else {
                            output.unshift(value).then(next);
                        }
                    });
                });
            };
            next();
        });
    });
}; };

});

var deferredPromise = createCommonjsModule(function (module, exports) {
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

});

var remote = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });






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
    var _a = deferredPromise.createDeferredPromise(), remotePromise = _a.promise, resolveRemote = _a.resolve;
    Promise.resolve(getOptions()).then(function (_a) {
        var adapter = _a.adapter, _b = _a.info, info = _b === void 0 ? {} : _b;
        var uid = createUID();
        var dests = {};
        var connections = new Map();
        var promises = new Map();
        var messageQueue = queue.createQueue();
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
                connections.set(cid, wrapAsyncIterableIterator_1.wrapAsyncIterableIterator(call.apply(void 0, args)));
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
            return duplex.createDuplex(function (input, output) {
                var cid = createUID();
                var cpom = deferredPromise.createDeferredPromise();
                var pumpRemoteCall = function (did, info) {
                    pump_1.pump(input, function (value) {
                        var pid = createUID();
                        var pom = deferredPromise.createDeferredPromise();
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
                        var pom = deferredPromise.createDeferredPromise();
                        promises.set(pid, pom);
                        pom.promise.then(output.return);
                        adapter.send(createRemoteMessage(RemoteMessageType.RETURN, uid, did, [pid, cid, value]));
                    });
                };
                var waitForResponse = function () {
                    var cpom = deferredPromise.createDeferredPromise();
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
    return proxy.proxy(function () { return remotePromise; });
};

});

var when = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Conditional that calls target functions based on the tester
 *
 * @param {Function} tester test function for the arguments passed in `when`
 * @param {Function} [then] called when test passes `true`
 * @param {Function} [else] called when test passes `false`
 *
 * @example
 *
 * const sift = require("sift");
 *
 * const dataStore = (items) => {
 *
 *   const findMulti = (message) => items.filter(sift(message.query));
 *   const findOne = (message) => items.find(sift(message.query));
 *   const remove = (message) => { }
 *
 *   return when(
 *     message => message.type === 'find',
 *     when(
 *       message => message.multi,
 *       findMulti,
 *       findOne
 *     ),
 *     when(
 *       message => message.type === 'remove',
 *       remove
 *     )
 *   )
 *
 *   return when(message => message.multi, findMulti, findOne);
 * };
 *
 * const dsDispatch = dataStore([
 *  { name: 'Jeff', age: 2 },
 *  { name: 'Samantha', age: 65 },
 *  { name: 'Craig', age: 99 }
 * ]);
 *
 * const people = await readAll(dsDispatch({ multi: true, query: { age: { $gt: 2 } } })); // [[{ name: 'Samantha', age: 65 }, { name: 'Craig', age: 99 }]]
 *
 * const person = await readAll(dsDispatch({ query: { age: 2 }})); // [{ name: 'Jeff', age: 2 }]
 *
 */
exports.when = function (_if, _then, _else) { return proxy.proxy(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return _if.apply(void 0, args) ? _then : _else;
}); };

});

var channel = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates a new messaging channel over an existing message stream.
 */
exports.channel = function (channel, call, info) {
    //  const callRemote = remote({
    //   info: info,
    //   adapter: {
    //     send(message) {
    //     },
    //     addListener(listener) {
    //     }
    //   }
    // }, call);
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
};

});

var parallel = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Executes a message against all target functions at the same time.
 */
exports.parallel = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return combine.combine(fns, function (items, each) {
        return Promise.all(items.map(each));
    });
};

});

var sequence = createCommonjsModule(function (module, exports) {
"use strict";
var _this = commonjsGlobal;
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Executes functions in sequence
 *
 * @example
 *
 *
 * const ping = sequence(
 *  () => "pong1",
 *  () => "pong2"
 * );
 *
 * const iter = ping();
 * await iter.next(); // { value: "pong1", done: false }
 * await iter.next(); // { value: "pong2", done: false }
 * await iter.next(); // { value: undefined, done: true }
 */
exports.sequence = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return combine.combine(fns, function (items, each) {
        return new Promise(function (resolve, reject) {
            var next = function (index) {
                if (index === items.length)
                    return resolve();
                each(items[index]).then(next.bind(_this, index + 1)).catch(reject);
            };
            next(0);
        });
    });
};

});

var fallback = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });



exports.fallback = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return duplex.createDuplex(function (input, output) {
            var targets = fns.concat();
            var buffer = [];
            var nextTarget = function () {
                var targetFn = targets.shift();
                if (!targetFn) {
                    return output.return();
                }
                var targetIter = wrapAsyncIterableIterator_1.wrapAsyncIterableIterator(targetFn.apply(void 0, args));
                var hasData = false;
                var next = function (value) {
                    return targetIter.next(value).then(function (_a) {
                        var value = _a.value, done = _a.done;
                        if (!hasData) {
                            hasData = !done;
                        }
                        if (hasData) {
                            if (done) {
                                output.return();
                            }
                            else {
                                output.unshift(value);
                            }
                        }
                        // if there is data, then use the current target, otherwise
                        // freeze with a promise that never resolves & move onto the next target
                        return hasData ? true : new Promise(function () {
                            nextTarget();
                        });
                    }, function (e) {
                        if (targets.length && !hasData) {
                            nextTarget();
                        }
                        else {
                            output.throw(e);
                        }
                    });
                };
                var pumpInput = function () {
                    return input.next().then(function (_a) {
                        var value = _a.value, done = _a.done;
                        if (done) {
                            return targetIter.return(value);
                        }
                        else {
                            buffer.push(value);
                            return next(value).then(pumpInput);
                        }
                    });
                };
                pump_1.pump(buffer, next).then(pumpInput);
            };
            nextTarget();
        });
    };
};

});

var random = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var getFunctions = function (ops) { return ops.map(function (op) { return (typeof op === "function" ? op : op[1]); }); };
var getWeights = function (ops) { return ops.map(function (op) { return (typeof op === "function" ? 1 : op[0]); }); };
exports.random = function () {
    var ops = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ops[_i] = arguments[_i];
    }
    return combine.combine(getFunctions(ops), (function () {
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

});

var roundRobin = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Executes a message against one target function that is rotated with each message.
 */
exports.roundRobin = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return combine.combine(fns, (function () {
        var current = 0;
        return function (items, each) {
            var prev = current;
            current = (current + 1) & items.length;
            return each(items[prev]);
        };
    })());
};

});

var through_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });



// TODO - possibly endOnNoInput
function through(fn, keepOpen) {
    if (keepOpen === void 0) { keepOpen = false; }
    return duplex.createDuplex(function (input, output) {
        var nextInput = function () {
            input.next().then(function (_a) {
                var value = _a.value;
                if (value == null) {
                    if (!keepOpen) {
                        return output.return();
                    }
                }
                return pump_1.pump(wrapAsyncIterableIterator_1.wrapAsyncIterableIterator(fn(value)), function (value) {
                    return output.unshift(value);
                }).then(nextInput);
            });
        };
        nextInput();
    });
}
exports.through = through;

});

var pipe_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Pipes yielded data though each iterable in the pipeline
 *
 * @param {AsyncIterableIterator|IterableIterator} source the first iterable in the pipeline
 * @param {AsyncIterableIterator|IterableIterator} [through] proceeding iterables to pass yielded data through
 *
 * @example
 * import { pipe, through, readAll } from "mesh";
 *
 * const negate = (values) => pipe(
 *   values,
 *   through(a => -a)
 * );
 *
 * const negativeValues = await readAll(negate([1, 2, 3])); // [-1, -2, -3]
 *
 */
function pipe() {
    var _this = this;
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i] = arguments[_i];
    }
    var _done = false;
    var targets = items.map(wrapAsyncIterableIterator_1.wrapAsyncIterableIterator);
    var call = function (methodName, value) {
        return new Promise(function (resolve, reject) {
            var remaining = targets.concat();
            var next = function (_a) {
                var value = _a.value, done = _a.done;
                if (!_done) {
                    _done = done;
                }
                // if one piped item finishes, then we need to finish
                if (!remaining.length || _done) {
                    if (methodName === "next") {
                        while (remaining.length) {
                            (remaining.shift().return || (function () { }))();
                        }
                    }
                    return resolve({ value: value, done: done });
                }
                var fn = remaining.shift()[methodName];
                return fn ? fn(value).then(next, reject) : next(value);
            };
            next({ value: value, done: false });
        });
    };
    return _a = {},
        _a[Symbol.asyncIterator] = function () { return _this; },
        _a.next = call.bind(this, "next"),
        _a.return = call.bind(this, "return"),
        _a.throw = call.bind(this, "throw"),
        _a;
    var _a;
}
exports.pipe = pipe;

});

var readAll_1 = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

function readAll(source) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var result = [];
        pump_1.pump(source, function (chunk) { return result.push(chunk); }).then(resolve.bind(_this, result)).catch(reject);
    });
}
exports.readAll = readAll;

});

var race = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });




/**
 * Calls all target functions in parallel, and returns the yielded values of the _fastest_ one.
 *
 * @example
 *
 * const ping = race(
 *
 * );
 */
exports.race = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return duplex.createDuplex(function (input, output) {
            var primaryInput = input;
            var wonFn;
            fns.forEach(function (fn, i) {
                var spareInput;
                _a = tee.tee(primaryInput), spareInput = _a[0], primaryInput = _a[1];
                var iter = wrapAsyncIterableIterator_1.wrapAsyncIterableIterator(fn.apply(void 0, args));
                pump_1.pump(spareInput, function (value) {
                    return iter.next(value).then(function (_a) {
                        var value = _a.value, done = _a.done;
                        if (wonFn && wonFn !== fn) {
                            return;
                        }
                        wonFn = fn;
                        if (done) {
                            output.return();
                        }
                        else {
                            output.unshift(value);
                        }
                    });
                }).then(function () {
                    if (wonFn === fn) {
                        output.return();
                    }
                });
                var _a;
            });
        });
    };
};

});

var timeout = createCommonjsModule(function (module, exports) {
"use strict";
var _this = commonjsGlobal;
Object.defineProperty(exports, "__esModule", { value: true });

var TIMEOUT = 1000 * 115; // default TTL specified by some browsers
var createDefaultError = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new Error("Timeout calling function.");
};
exports.timeout = function (fn, ms, createError) {
    if (ms === void 0) { ms = TIMEOUT; }
    if (createError === void 0) { createError = createDefaultError; }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _completed;
        var _timeout;
        var _error;
        var resetTimeout = function () {
            clearTimeout(_timeout);
            _timeout = setTimeout(function () {
                _error = createError.apply(void 0, args);
            }, ms);
        };
        resetTimeout();
        var iter = wrapAsyncIterableIterator_1.wrapAsyncIterableIterator(fn.apply(void 0, args));
        return _a = {},
            _a[Symbol.asyncIterator] = function () { return _this; },
            _a.next = function (value) {
                if (_error) {
                    return Promise.reject(_error);
                }
                resetTimeout();
                return iter.next(value).then(function (result) {
                    if (_error)
                        return Promise.reject(_error);
                    resetTimeout();
                    if (result.done) {
                        clearTimeout(_timeout);
                    }
                    return result;
                });
            },
            _a;
        var _a;
    };
};

});

var limit = createCommonjsModule(function (module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });



exports.limit = function (fn, max) {
    if (max === void 0) { max = 1; }
    var queue$$2 = queue.createQueue();
    var queueCount = 0;
    var next = function () {
        if (queueCount >= max) {
            return;
        }
        queueCount++;
        queue$$2.unshift(sequence.sequence(fn, function () { return queueCount-- && next(); })).then(next);
    };
    next();
    return proxy.proxy(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return queue$$2.next().then(function (_a) {
            var value = _a.value;
            return value;
        });
    });
};

});

var index = createCommonjsModule(function (module, exports) {
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
Symbol.asyncIterator = Symbol.asyncIterator || Symbol("Symbol.asyncIterator");
__export(combine);
__export(remote);
__export(when);
__export(proxy);
__export(channel);
__export(parallel);
__export(sequence);
__export(fallback);
__export(random);
__export(roundRobin);
__export(through_1);
__export(pipe_1);
__export(pump_1);
__export(deferredPromise);
__export(queue);
__export(wrapAsyncIterableIterator_1);
__export(duplex);
__export(readAll_1);
__export(race);
__export(tee);
__export(timeout);
__export(limit);

});

var index$1 = unwrapExports(index);

return index$1;

}());
