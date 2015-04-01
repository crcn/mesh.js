(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 */

module.exports = {
  parallel  : require("./parallel"),
  sequence  : require("./sequence"),
  operation : require("./operation"),
  delta     : require("./delta"),
  child     : require("./child"),
  stream    : require("./open"),
  open      : require("./open"),
  tailable  : require("./tailable")
};

},{"./child":2,"./delta":3,"./open":4,"./operation":5,"./parallel":6,"./sequence":7,"./tailable":8}],2:[function(require,module,exports){
var createOperation = require("./operation");
var extend          = require("xtend/mutable");

module.exports = function(db, options) {
  return function(name, properties) {
    return db(name, extend({}, properties, options));
  };
};

},{"./operation":5,"xtend/mutable":19}],3:[function(require,module,exports){
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

},{"obj-stream":12}],4:[function(require,module,exports){
var through = require("obj-stream").through;

module.exports = function(db) {
  return through(function(operation, next) {
    var self = this;
    db(operation.name, operation).on("data", function(data) {
      self.push(data);
    }).on("end", next);
  });
};

},{"obj-stream":12}],5:[function(require,module,exports){
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

},{"xtend/mutable":19}],6:[function(require,module,exports){
(function (process){
var Writable = require("obj-stream").Writable;

/**
 */

module.exports = function() {
  var dbs = Array.prototype.slice.apply(arguments);
  return function(name, properties) {
    var i = 0;
    var self = this;

    var stream = new Writable();

    process.nextTick(function() {
      dbs.forEach(function(db) {
        db(name, properties).on("data", function(data) {
          stream.write(data);
        }).on("end", function() {
          if (++i >= dbs.length) {
            return stream.end();
          }
        });
      });
    });

    return stream.reader;
  };
};

}).call(this,require('_process'))
},{"_process":10,"obj-stream":12}],7:[function(require,module,exports){
(function (process){
var Writable = require("obj-stream").Writable;

/**
 */

module.exports = function() {
  var dbs = Array.prototype.slice.apply(arguments);
  return function(name, properties) {
    var i = 0;

    var stream = new Writable();

    process.nextTick(function() {
      function run() {
        if (i >= dbs.length) return stream.end();
        var db = dbs[i++];
        db(name, properties).on("data", function(data) {
          stream.write(data);
        }).on("end", run);
      }
      run();
    });

    return stream.reader;
  };
};

}).call(this,require('_process'))
},{"_process":10,"obj-stream":12}],8:[function(require,module,exports){
var Stream       = require("obj-stream").Stream;
var operation    = require("./operation");

module.exports = function(db, reject) {
  if (!reject) reject = ["load"];
  var tails = [];

  return function(name, properties) {
    var stream;
    if (name === "tail") {
      stream = new Stream();
      tails.push(stream);
    } else {
      var self = this;
      stream = db(name, properties);
      stream.on("data", function() { });
      stream.on("end", function() {
        if (~reject.indexOf(name)) return;
        for (var i = tails.length; i--;) tails[i].emit("data", operation(name, properties));
      });
    }
    return stream;
  };
};

},{"./operation":5,"obj-stream":12}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./writable":17,"protoclass":18}],12:[function(require,module,exports){
var Readable = require("./readable");
var Writable = require("./writable");
var Stream   = require("./Stream");
var through  = require("./through");

exports.Readable = Readable;
exports.readable = Readable;

exports.Writable = Writable;
exports.writable = Writable;

exports.Stream = Stream;
exports.stream = Stream;

exports.through = through;

},{"./Stream":11,"./readable":14,"./through":16,"./writable":17}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"./pipe":13,"events":9,"protoclass":18}],15:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"./writable":17,"dup":11,"protoclass":18}],16:[function(require,module,exports){
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

},{"./readable":14,"./stream":15,"./writable":17,"protoclass":18}],17:[function(require,module,exports){
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

    if (object != void 0) {
      this.write(object);
    }

    this.reader.emit("end");
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
    this.emit("drain");
    while (this._pool.length) {
      var item = this._pool.shift();
      if (!this._write(item)) {
        this._pool.unshift(item);
        break;
      }
    }
  }
});

module.exports = Writable;

},{"./readable":14,"events":9,"protoclass":18}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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
