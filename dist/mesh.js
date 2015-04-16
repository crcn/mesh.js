(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 */

module.exports = {
  parallel     : require("./parallel"),
  sequence     : require("./sequence"),
  first        : require("./first"),
  operation    : require("./operation"),
  op           : require("./operation"),
  delta        : require("./delta"),
  child        : require("./child"),
  stream       : require("./open"),
  run          : require("./run"),
  wrapCallback : require("./wrapCallback"),
  open         : require("./open"),
  tailable     : require("./tailable"),
  accept       : require("./accept"),
  reject       : require("./reject"),
  clean        : require("./top"),
  top          : require("./top")
};

},{"./accept":8,"./child":9,"./delta":10,"./first":11,"./open":12,"./operation":13,"./parallel":14,"./reject":15,"./run":16,"./sequence":17,"./tailable":18,"./top":19,"./wrapCallback":20}],2:[function(require,module,exports){
(function (process){
var Writable = require("obj-stream").Writable;

/**
 */

module.exports = function(fn) {
  var stream = new Writable();

  process.nextTick(function() {
    fn(stream);
  });

  return stream.reader;
};

}).call(this,require('_process'))
},{"_process":22,"obj-stream":23}],3:[function(require,module,exports){
module.exports = function(items, each, complete) {
  var i = 0;
  var completed = false;

  function done() {
    if (completed) return;
    return complete.apply(this, arguments);
  }

  items.forEach(function(item) {
    each(item, function(err, item) {
      if (err) return done(err);
      if (++i == items.length) return done();
    });
  });
};

},{}],4:[function(require,module,exports){
module.exports = function(items, each, complete) {
  var i = 0;

  function run() {
    if (i >= items.length) return complete();
    each(items[i++], function(err, item) {
      if (err) return complete(err);
      run();
    });
  }

  run();
};

},{}],5:[function(require,module,exports){
var _id = 0;

module.exports = function(targetBus) {
  return function() {

    var busses = [];
    var sorted = [];

    Array.prototype.slice.call(arguments).forEach(addBus);

    function sort() {
      sorted = sorted.sort(function(a, b) {
        return a.priority > b.priority ? 1 : -1;
      });
      busses = sorted.map(function(item) {
        return item.bus;
      });
    }

    function groupBus(operation) {
      return targetBus(operation, busses);
    }

    function addBus(bus, priority) {

      sorted.push({
        bus      : bus,
        priority : priority || busses.length
      });

      sort();
    };

    function removeBus(bus) {
      var i = busses.indexOf(bus);

      if (~i) {
        busses.splice(i, 1);
        return true;
      }

      return false;
    };

    groupBus.add    = addBus;
    groupBus.remove = removeBus;

    // add mutation ops here such as push/remove

    return groupBus;
  };
};

},{}],6:[function(require,module,exports){
var _group = require("./_group");
var _async = require("./_async");

module.exports = function(iterator) {
  return _group(function(operation, busses) {
    return _async(function(stream) {
      iterator(busses, function(bus, complete) {
        bus(operation).on("data", function(data) {
          stream.write(data);
        }).on("end", complete);
      }, function() {
        stream.end();
      });
    });
  });
};

},{"./_async":2,"./_group":5}],7:[function(require,module,exports){
module.exports = function(data) {
  if (data == void 0) return [];
  return Object.prototype.toString.call(data) === "[object Array]" ? data : [data];
};

},{}],8:[function(require,module,exports){
var stream = require("obj-stream");
var _async   = require("./_async");

module.exports = function() {

  var args   = Array.prototype.slice.call(arguments).map(function(a) {
    var toa = typeof a;
    if (toa === "string") return function(b) {
      return a === b.name;
    };

    if (toa === "function") return a;
  });

  var bus     = args.pop();
  var accept = args;

  return function(operation) {
    for (var i = accept.length; i--;) {
      if (accept[i](operation)) return bus.apply(this, arguments);
    }
    return _async(function(writable) {
      writable.end();
    });
  };
};

},{"./_async":2,"obj-stream":23}],9:[function(require,module,exports){
var createOperation = require("./operation");
var extend          = require("xtend/mutable");

module.exports = function(bus, options) {
  return function(operation) {
    return bus(extend({}, operation, options));
  };
};

},{"./operation":13,"xtend/mutable":30}],10:[function(require,module,exports){
var through = require("obj-stream").through;

module.exports = function() {
  var prev = {};
  return through(function(data, next) {
    var delta = {};

    for (var key in data) {
      if (data[key] !== prev[key]) {
        delta[key] = prev[key] = data[key];
      }
    }

    if (Object.keys(delta).length) {
      this.push(delta);
    }

    next();
  });
};

},{"obj-stream":23}],11:[function(require,module,exports){
var Writable    = require("obj-stream").Writable;
var _async      = require("./_async");
var _eachSeries = require("./_eachSeries");
var _group      = require("./_group");

/**
 */

module.exports = _group(function(operation, busses) {
  return _async(function(stream) {
    var found = false;
    _eachSeries(busses, function(bus, next) {
      bus(operation).on("data", function(data) {
        found = true;
        stream.write(data);
      }).on("end", function() {
        if (found) {
          return stream.end();
        } else {
          return next();
        }
      });
    }, function() {
      stream.end();
    });
  });
});

},{"./_async":2,"./_eachSeries":4,"./_group":5,"obj-stream":23}],12:[function(require,module,exports){
var through = require("obj-stream").through;

module.exports = function(bus) {
  return through(function(operation, next) {
    var self = this;
    bus(operation).on("data", function(data) {
      self.push(data);
    }).on("end", next);
  });
};

},{"obj-stream":23}],13:[function(require,module,exports){
var extend = require("xtend/mutable");

/**
 */

function Operation(name, options) {
  if (!options) options = {};
  extend(this, options);
  this.name = name;
}

/**
 */

module.exports = function(name, options) {
  return new Operation(name, options);
};

},{"xtend/mutable":30}],14:[function(require,module,exports){
var _eachParallel = require("./_eachParallel");
var _merge        = require("./_merge");

/**
 */

module.exports = _merge(_eachParallel);

},{"./_eachParallel":3,"./_merge":6}],15:[function(require,module,exports){
var stream = require("obj-stream");
var _async   = require("./_async");

module.exports = function() {

  var args   = Array.prototype.slice.call(arguments).map(function(a) {
    var toa = typeof a;
    if (toa === "string") return function(b) {
      return a === b.name;
    };

    if (toa === "function") return a;
  });

  var bus     = args.pop();
  var reject = args;

  return function(operation) {

    for (var i = reject.length; i--;) {
      if (reject[i](operation)) return _async(function(writable) {
        writable.end();
      });
    }

    return bus.apply(this, arguments);
  };
};

},{"./_async":2,"obj-stream":23}],16:[function(require,module,exports){
var operation = require("./operation");

module.exports = function(bus, operationName, options, onRun) {
  var buffer = [];
  bus(operation(operationName, options)).
  on("data", function(data) {
    buffer.push(data);
  }).
  on("error", onRun).
  on("end", function() {
    if (options.multi) {
      return onRun(void 0, buffer);
    } else {
      return onRun(void 0, buffer.length ? buffer[0] : void 0);
    }
  });
};

},{"./operation":13}],17:[function(require,module,exports){
var _eachSeries = require("./_eachSeries");
var _merge      = require("./_merge");

/**
 */

module.exports = _merge(_eachSeries);

},{"./_eachSeries":4,"./_merge":6}],18:[function(require,module,exports){

module.exports = function(bus, reject) {
  if (!reject) reject = ["load"];
  var tails = [];

  return function(operation) {
    var stream;
    if (operation.name === "tail") {
      stream = bus(operation);
      tails.push(stream);
    } else {
      var self = this;
      stream = bus(operation);
      stream.on("data", function() { });
      stream.on("end", function() {
        if (~reject.indexOf(operation.name)) return;
        for (var i = tails.length; i--;) tails[i].emit("data", operation);
      });
    }
    return stream;
  };
};

},{}],19:[function(require,module,exports){
var operation = require("./operation");

module.exports = function(bus) {
  return function(operationName, options) {

    if (typeof operationName === "object") {
      return bus(operationName);
    }

    return bus(operation(operationName, options));
  };
};

},{"./operation":13}],20:[function(require,module,exports){
var stream   = require("obj-stream");
var _toArray = require("./_toArray");
var _async   = require("./_async");

module.exports = function(callback) {
  return function(operation) {
    return _async(function(writer) {
      callback(operation, function(err, data) {
        if (err) return writer.reader.emit("error", err);

        _toArray(data).forEach(function(data) {
          writer.write(data);
        });

        writer.end();
      });
    });
  };
};

},{"./_async":2,"./_toArray":7,"obj-stream":23}],21:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],22:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],23:[function(require,module,exports){
var Readable = require("./readable");
var Writable = require("./writable");
var Stream   = require("./stream");
var through  = require("./through");

exports.Readable = Readable;
exports.readable = Readable;

exports.Writable = Writable;
exports.writable = Writable;

exports.Stream = Stream;
exports.stream = Stream;

exports.through = through;

},{"./readable":25,"./stream":26,"./through":27,"./writable":28}],24:[function(require,module,exports){
module.exports = function(src, dst, ops) {

  var listeners = [];

  function cleanup() {
    for (var i = listeners.length; i--;) listeners[i].dispose();
  }

  function onData(data) {
    if (dst.writable && dst.write(data) === false) {
      src.pause();
    }
  }

  function onDrain() {
    if (src.readable) {
      src.resume();
    }
  }

  function onError(error) {
    cleanup();
    dst.emit("error", error);
    // TODO: throw error if there are no handlers here
  }

  var didEnd = false;

  function onEnd() {
    if (didEnd) return;
    didEnd = true;
    dst.end();
  }

  function onClose() {
    if (didEnd) return;
    didEnd = true;
    if (typeof dst.destroy === "function") dst.destroy();
  }

  function listen(target, event, listener) {
    target.on(event, listener);
    return {
      dispose: function() {
        return target.removeListener(event, listener);
      }
    };
  }

  if (!ops || ops.end !== false) {
    listeners.push(
      listen(src, "end", onEnd),
      listen(src, "close", onClose)
    );
  }

  listeners.push(
    listen(src, "data", onData),
    listen(dst, "drain", onDrain),
    listen(src, "end", cleanup),
    listen(src, "close", cleanup),
    listen(dst, "close", cleanup),
    listen(src, "error", onError),
    listen(dst, "error", onError)
  );

  dst.emit("pipe", src);

  return dst;
};

},{}],25:[function(require,module,exports){
var protoclass   = require("protoclass");
var EventEmitter = require("events").EventEmitter;
var pipe         = require("./pipe");

/**
 */

function Readable () {
  if (!(this instanceof Readable)) return new Readable();
  EventEmitter.call(this);
}

/**
 */

protoclass(EventEmitter, Readable, {

  /**
   */

  _flowing: true,
  readable: true,
  writable: false,

  /**
   */

  pause: function() {
    if (!this._flowing) return;
    this._flowing = false;
    this.emit("pause");
  },

  /**
   */

  resume: function() {
    if (this._flowing) return;
    this._flowing = true;
    this.emit("resume");
  },

  /**
   */

  isPaused: function() {
    return !this._flowing;
  },

  /**
   */

  pipe: function(dst, ops) {
    return pipe(this, dst, ops);
  }
});

module.exports = Readable;

},{"./pipe":24,"events":21,"protoclass":29}],26:[function(require,module,exports){
var protoclass = require("protoclass");
var Writer     = require("./writable");

/**
 */

function Stream (reader, writer) {
  if (!(this instanceof Stream)) return new Stream();
  this._writer = writer || new Writer();
  this._reader = reader || this._writer.reader;
}

/**
 */

protoclass(Stream, {

  /**
   */

  readable: true,
  writable: true,

  /**
   */

  pause: function() {
    return this._reader.pause();
  },

  /**
   */

  resume: function() {
    return this._reader.resume();
  },

  /**
   */

  write: function(object) {
    return this._writer.write.apply(this._writer, arguments);
  },

  /**
   */

  end: function(object) {
    return this._writer.end.apply(this._writer, arguments);
  },

  /**
   */

  emit: function() {
    return this._reader.emit.apply(this._reader, arguments);
  },

  /**
   */

  on: function() {
    this._reader.on.apply(this._reader, arguments);
    return this;
  },

  /**
   */

  once: function() {
    this._reader.once.apply(this._reader, arguments);
    return this;
  },

  /**
   */

  removeListener: function() {
    return this._reader.removeListener.apply(this._reader, arguments);
  },

  /**
   */

  pipe: function() {
    return this._reader.pipe.apply(this._reader, arguments);
  }
});

module.exports = Stream;

},{"./writable":28,"protoclass":29}],27:[function(require,module,exports){
var protoclass = require("protoclass");
var Readable   = require("./readable");
var Stream     = require("./stream");
var Writable   = require("./writable");

/**
 */

function Through (stream) {
  this._stream = stream;
}

/**
 */

protoclass(Through, {
  push: function(object) {
    this._stream.write(object);
  }
});

/**
 */

module.exports = function(write, end) {

  var dstWriter = new Writable();
  var srcWriter = new Writable();
  var stream    = new Stream(dstWriter.reader, srcWriter);
  var through   = new Through(dstWriter);

  var buffer  = [];
  var running = false;
  var ended   = false;

  function _write() {
    if (running) return;

    if (buffer.length) {
      running = true;
      return write.call(through, buffer.shift(), function() {
        running = false;
        _write();
      });
    }

    if (ended) {
      dstWriter.end();
    }
  }

  srcWriter.reader.on("data", function(data) {
    buffer.push(data);
    _write();
  }).on("end", function() {
    ended = true;
    _write();
  });

  return stream;
};

},{"./readable":25,"./stream":26,"./writable":28,"protoclass":29}],28:[function(require,module,exports){
var protoclass   = require("protoclass");
var EventEmitter = require("events").EventEmitter;
var Reader       = require("./readable");

/**
 */

function Writable () {
  if (!(this instanceof Writable)) return new Writable();
  EventEmitter.call(this);

  this._pool  = [];
  this.reader = new Reader();

  var self = this;

  this.reader.on("pause", function() {
    self._pause();
  });

  this.reader.on("resume", function() {
    self._resume();
  });

}

/**
 */

protoclass(EventEmitter, Writable, {

  /**
   */

  _flowing: true,
  readable: false,

  /**
   */

  write: function(object) {
    if (!this._write(object)) {
      this._pool.push(object);
      return false;
    }
    return true;
  },

  /**
   */

  end: function(object) {

    this._ended = true;

    if (object != void 0) {
      this.write(object);
    }

    if (this._flowing) {
      this.reader.emit("end");
    }
  },

  /**
   */

  _write: function(object) {
    if (this._flowing) {
      this.reader.emit("data", object);

      // might have changed on emit
      return this._flowing;
    } else {
      return false;
    }
  },

  /**
   */

  _pause: function() {
    this._flowing = false;
  },

  /**
   */

  _resume: function() {
    if (this._flowing) return;
    this._flowing = true;
    this.reader.emit("drain");

    while (this._pool.length) {
      var item = this._pool.shift();
      if (!this._write(item)) {
        this._pool.unshift(item);
        break;
      }
    }

    if (!this._pool.length && this._ended) {
      this.end();
    }
  }
});

module.exports = Writable;

},{"./readable":25,"events":21,"protoclass":29}],29:[function(require,module,exports){
function _copy (to, from) {

  for (var i = 0, n = from.length; i < n; i++) {

    var target = from[i];

    for (var property in target) {
      to[property] = target[property];
    }
  }

  return to;
}

function protoclass (parent, child) {

  var mixins = Array.prototype.slice.call(arguments, 2);

  if (typeof child !== "function") {
    if(child) mixins.unshift(child); // constructor is a mixin
    child   = parent;
    parent  = function() { };
  }

  _copy(child, parent); 

  function ctor () {
    this.constructor = child;
  }

  ctor.prototype  = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  child.parent    = child.superclass = parent;

  _copy(child.prototype, mixins);

  protoclass.setup(child);

  return child;
}

protoclass.setup = function (child) {


  if (!child.extend) {
    child.extend = function(constructor) {

      var args = Array.prototype.slice.call(arguments, 0);

      if (typeof constructor !== "function") {
        args.unshift(constructor = function () {
          constructor.parent.apply(this, arguments);
        });
      }

      return protoclass.apply(this, [this].concat(args));
    }

    child.mixin = function(proto) {
      _copy(this.prototype, arguments);
    }

    child.create = function () {
      var obj = Object.create(child.prototype);
      child.apply(obj, arguments);
      return obj;
    }
  }

  return child;
}


module.exports = protoclass;
},{}],30:[function(require,module,exports){
module.exports = extend

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[1]);
