(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Bus = require(3);
var NoopBus = require(10);
var Response = require(27);

/**
 */

function AcceptBus(filter, acceptBus, rejectBus) {
  this._filter    = filter;
  this._acceptBus = acceptBus || NoopBus.create();
  this._rejectBus = rejectBus || NoopBus.create();
}

/**
 */

Bus.extend(AcceptBus, {

  /**
   */

  execute: function (action) {
    var self = this;
    var accepted = this._filter(action);

    if (accepted && accepted.then) {
      return Response.create(function (writable) {
        accepted.then(function (yes) {
          self._execute(yes, action).pipeTo(writable);
        }, writable.abort.bind(writable));
      });
    }

    return this._execute(accepted, action);
  },

  /**
   */

  _execute: function (yes, action) {
    return yes ? this._acceptBus.execute(action) : this._rejectBus.execute(action);
  }
});

/**
 */

module.exports =  AcceptBus;

},{"10":10,"27":27,"3":3}],2:[function(require,module,exports){
var Bus = require(3);

/**
 */

function _defaults(to) {
  var props = Array.prototype.slice.call(arguments, 1);
  for (var i = 0, n = props.length; i < n; i++) {
    var obj = props[i];
    for (var key in obj) {
      if (to[key] == void 0) to[key] = obj[key];
    }
  }
  return to;
}

/**
 */

function AttachDefaultsBus(properties, bus) {
  this._properties = properties;
  this._bus        = bus;
}

/**
 */

 Bus.extend(AttachDefaultsBus, {
  execute: function (action) {
    return this._bus.execute(_defaults(action, this._properties));
  }
});

/**
 */

module.exports =  AttachDefaultsBus;

},{"3":3}],3:[function(require,module,exports){
var extend = require(22);

/**
 */

function Bus() {

}

/**
 */

extend(Bus, {

  /**
   */

  execute: function (action) {
    // OVERRIDE ME
  }
});

/**
 */

Bus.create = require(21);
Bus.extend = extend;

/**
 */

module.exports = Bus;

},{"21":21,"22":22}],4:[function(require,module,exports){
var Bus = require(3);
var BufferedResponse = require(24);

/**
 */

function BufferedBus(error, chunkValues) {
  this._error       = error;
  this._chunkValues = chunkValues;
}

/**
 */

 Bus.extend(BufferedBus, {

  /**
   */

  execute: function (action) {
    return BufferedResponse.create(this._error, this._chunkValues);
  }
});

/**
 */

module.exports =  BufferedBus;

},{"24":24,"3":3}],5:[function(require,module,exports){
var Bus = require(3);
var Response = require(27);

/**
 */

function CatchErrorBus(bus, catchError) {
  this._bus        = bus;
  this._catchError = catchError;
}

/**
 */

 Bus.extend(CatchErrorBus, {

  /**
   */

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {
      self._bus.execute(action).pipeTo({
        write: writable.write.bind(writable),
        close: writable.close.bind(writable),
        abort: function abort(error) {
          try {
            var p = self._catchError(error, action);
            writable.close();
          } catch (e) {
            writable.abort(e);
          }
        }
      });
    });
  }
});

/**
 */

module.exports =  CatchErrorBus;

},{"27":27,"3":3}],6:[function(require,module,exports){
var Bus = require(3);
var Response = require(27);
var EmptyResponse = require(25);

/**
 */

function DelayedBus(bus, ms) {
  this._ms  = ms;
  this._bus = bus;
}

/**
 */

Bus.extend(DelayedBus, {
  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {
      setTimeout(function onTimeout() {
        (self._bus.execute(action) || EmptyResponse.create()).pipeTo(writable);
      }, self._ms);
    });
  }
});

/**
 */

module.exports = DelayedBus;

},{"25":25,"27":27,"3":3}],7:[function(require,module,exports){
var Bus = require(3);
var Response = require(27);
var EmptyResponse = require(25);

/**
 */

function FallbackBus(busses) {
  this._busses = busses;
}

/**
 */

 Bus.extend(FallbackBus, {

  /**
   */

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {
      var busses = self._busses.concat();
      function next(i) {
        if (i === busses.length) return writable.close();
        var response = busses[i].execute(action) || EmptyResponse.create();
        var hasChunk = false;
        response.pipeTo({
          write: function write(value) {
            hasChunk = true;
            writable.write(value);
          },
          close: function close() {
            if (hasChunk) {
              writable.close();
            } else {
              next(i + 1);
            }
          },
          abort: writable.abort.bind(writable)
        });
      }
      next(0);
    });
  }
});

/**
 */

module.exports =  FallbackBus;

},{"25":25,"27":27,"3":3}],8:[function(require,module,exports){
var Bus = require(3);
var Response = require(27);

function LimitBus(max, bus) {
  this.max = max;
  this.bus = bus;
  this._queue = [];
  this._running = 0;
}

Bus.extend(LimitBus, {
  execute: function (action) {
    var self = this;
    return new Response(function(writable) {
      if (self._running >= self.max) {
        return self._queue.push({
          action   : action,
          writable : writable
        });
      }

      self._running++;

      function complete() {
        self._running--;
        if (self._queue.length) {
          var item = self._queue.shift();
          self.execute(item.action).pipeTo(item.writable);
        }
      }

      self.bus.execute(action).pipeTo({
        write: writable.write.bind(writable),
        close: function() {
          writable.close();
          complete();
        },
        abort: function(reason) {
          writable.abort(reason);
          complete();
        }
      });
    });
  }
});

module.exports = LimitBus;
},{"27":27,"3":3}],9:[function(require,module,exports){
var Bus = require(3);
var Response = require(27);

/**
 */

function MapBus(bus, map) {
  this._bus = bus;
  this._map = map;
}

/**
 */

 Bus.extend(MapBus, {

  /**
   */

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {
      self._bus.execute(action).pipeTo({
        write: function write(value) {
          try {
            self._map(value, writable, action);
          } catch(e) {
            writable.abort(e);
            return Promise.reject(e);
          }
        },
        close: function close() {
          writable.close();
        },
        abort: writable.abort.bind(writable)
      });
    });
  }
});

/**
 */

module.exports =  MapBus;

},{"27":27,"3":3}],10:[function(require,module,exports){
var Bus = require(3);
var EmptyResponse = require(25);

/**
 */

function NoopBus() { }

/**
 */

 Bus.extend(NoopBus, {

  /**
   */

  execute: function (action) {
    return EmptyResponse.create();
  }
});

/**
 */

module.exports =  NoopBus;

},{"25":25,"3":3}],11:[function(require,module,exports){
var Bus = require(3);
var Response = require(27);
var EmptyResponse = require(25);

/**
 */

function ParallelBus(busses) {
  this._busses = busses;
}

/**
 */

Bus.extend(ParallelBus, {

  /**
   */

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {

      var busses  = self._busses.concat();
      var numLeft = busses.length;

      if (!numLeft) return EmptyResponse.create();

      busses.forEach(function forEach(bus) {
        var resp = bus.execute(action) || EmptyResponse.create();
        resp.pipeTo({
          write: writable.write.bind(writable),
          close: function close() {
            if (!(--numLeft)) writable.close();
          },
          abort: writable.abort.bind(writable)
        });
      });
    });
  }
});

/**
 */

module.exports =  ParallelBus;

},{"25":25,"27":27,"3":3}],12:[function(require,module,exports){
var Bus = require(3);
var Response = require(27);
var EmptyResponse = require(25);

/**
 */

function RaceBus(busses) {
  this._busses = busses;
}

/**
 */

Bus.extend(RaceBus, {

  /**
   */

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {
      var busses  = self._busses.concat();
      var numLeft = busses.length;
      var found   = -1;
      busses.forEach(function forEach(bus, i) {
        var response = bus.execute(action) || EmptyResponse.create();
        response.pipeTo({
          write: function write(value) {
            if ((~found && found !== i)) return;
            found = i;
            writable.write(value);
          },
          close: function close() {
            if ((~found && found === i) || (--numLeft) === 0) {
              writable.close();
            }
          },
          abort: writable.abort.bind(writable)
        });
      });
    });
  }
});

/**
*/

module.exports =  RaceBus;

},{"25":25,"27":27,"3":3}],13:[function(require,module,exports){
var Bus = require(3);

/**
 */

function RandomBus(busses) {
  this._busses = busses;
}

/**
 */

Bus.extend(RandomBus, {

  /**
   */

  execute: function (action) {
    return this._busses[Math.floor(Math.random() * this._busses.length)].execute(action);
  }
});

/**
 */

module.exports = RandomBus;

},{"3":3}],14:[function(require,module,exports){
var AcceptBus = require(1);

/**
 */

function RejectBus(filter, rejectBus, acceptBus) {
  AcceptBus.call(this, filter, acceptBus, rejectBus);
}

/**
 */

AcceptBus.extend(RejectBus);

/**
 */

module.exports =  RejectBus;

},{"1":1}],15:[function(require,module,exports){
var Bus = require(3);
var Response = require(27);

/**
 */

function RetryBus(maxRetries, errorFilter, bus) {

  if (arguments.length === 2) {
    bus         = errorFilter;
    errorFilter = function(error, action) {
      return true;
    };
  }

  this._maxRetries  = maxRetries;
  this._bus         = bus;
  this._errorFilter = errorFilter;
}

/**
 */

Bus.extend(RetryBus, {

  /**
   */

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {
      var hasChunk  = false;
      var prevError;

      function run(triesLeft) {
        if (!triesLeft) return writable.abort(prevError);
        var response = self._bus.execute(action);
        response.pipeTo({
          write: function write(value) {
            hasChunk = true;
            writable.write(value);
          },
          close: writable.close.bind(writable),
          abort: function abort(error) {
            prevError = error;
            run(triesLeft - 1);
          }
        });
      }

      run(self._maxRetries);
    });
  }
});

/**
 */

module.exports =  RetryBus;

},{"27":27,"3":3}],16:[function(require,module,exports){
var Bus = require(3);
var EmptyResponse = require(25);

/**
 */

function RoundRobinBus(busses) {
  this._busses = busses;
  this._i = 0;
}

/**
 */

Bus.extend(RoundRobinBus, {

  /**
   */

  execute: function (action) {
    var ret = this._busses[this._i].execute(action);
    this._i = (this._i + 1) % this._busses.length;
    return ret;
  }
});

/**
 */

module.exports = RoundRobinBus;

},{"25":25,"3":3}],17:[function(require,module,exports){
var Bus = require(3);
var Response = require(27);
var EmptyResponse = require(25);

/**
 */

function SequenceBus(busses) {
  this._busses = busses;
}

/**
 */

Bus.extend(SequenceBus, {

  /**
   */

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {

      // copy incase the collection mutates (unlikely but possible)
      var busses = self._busses.concat();

      function next(i) {
        if (i === busses.length) return writable.close();
        var resp = busses[i].execute(action) || EmptyResponse.create();
        resp.pipeTo({
          write: writable.write.bind(writable),
          close: next.bind(self, i + 1),
          abort: writable.abort.bind(writable)
        });
      }

      next(0);
    });
  }
});

/**
 */

module.exports = SequenceBus;

},{"25":25,"27":27,"3":3}],18:[function(require,module,exports){
var Bus              = require(3);
var Response         = require(27);
var BufferedResponse = require(24);
var WrapResponse     = require(29);

/**
*/

function WrapBus(execute) {
  var self = this;

  // node style? (next(err, result))
  if (execute.length >= 2) {
    this._execute = function(action) {
      return new Promise(function run(resolve, reject) {
        execute(action, function (err, result) {
          if (err) return reject(err);
          resolve.apply(self, Array.prototype.slice.call(arguments, 1));
        });
      });
    };
  } else {
    this._execute = execute;
  }
}

/**
*/

Bus.extend(WrapBus, {

  /**
   */

  execute: function (action) {
    return WrapResponse.create(this._execute(action));
  }
});

WrapBus.create = function (callback) {
  if (callback.execute) return callback;
  return Bus.create.call(WrapBus, callback);
};

/**
*/

module.exports =  WrapBus;

},{"24":24,"27":27,"29":29,"3":3}],19:[function(require,module,exports){

module.exports = {

  /**
   * busses
   */

  Bus               : require(3),
  MapBus            : require(9),
  NoopBus           : require(10),
  WrapBus           : require(18),
  RaceBus           : require(12),
  RetryBus          : require(15),
  LimitBus          : require(8),
  RandomBus         : require(13),
  AcceptBus         : require(1),
  RejectBus         : require(14),
  DelayedBus        : require(6),
  SequenceBus       : require(17),
  ParallelBus       : require(11),
  BufferedBus       : require(4),
  FallbackBus       : require(7),
  CatchErrorBus     : require(5),
  RoundRobinBus     : require(16),
  AttachDefaultsBus : require(2),

  // TODO
  // ReduceBus:require('./bus/reduce'),

  /**
   * responses
   */

  Response           : require(27),
  WrapResponse       : require(29),
  EmptyResponse      : require(25),
  ErrorResponse      : require(26),
  BufferedResponse   : require(24),
  NodeStreamResponse : require(28),

  /**
   */

  WritableStream     : require(32)
};

if (typeof window !== 'undefined') {

  module.exports.noConflict = function() {
    delete window.mesh;
    return module.exports;
  };

  window.mesh = module.exports;
}

},{"1":1,"10":10,"11":11,"12":12,"13":13,"14":14,"15":15,"16":16,"17":17,"18":18,"2":2,"24":24,"25":25,"26":26,"27":27,"28":28,"29":29,"3":3,"32":32,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9}],20:[function(require,module,exports){
module.exports = function(to) {
  var fromObjects = Array.prototype.slice.call(arguments, 1);
  for (var i = 0, n = fromObjects.length; i < n; i++) {
    var fm = fromObjects[i];
    for (var key in fm) {
      to[key] = fm[key];
    }
  }
  return to;
}

},{}],21:[function(require,module,exports){
module.exports = function() {
  var object = Object.create(this.prototype);
  this.apply(object, arguments);
  return object;
};

},{}],22:[function(require,module,exports){
var copy = require(20);

/**
 * IE8+ compatible subclassing. See https://babeljs.io/docs/advanced/caveats/
 */

module.exports = function(parent, child) {

  var props;
  var pi;

  var c = child;
  var p = parent;

  if (typeof c === 'function') {
    pi = 2;
  } else {
    if (typeof p === 'object') {
      c = function() { p.apply(this, arguments); }
      pi = 0;
    } else {
      c = p || function() { };
      pi = 1;
    }

    p = typeof this === 'function' ? this : Object;
  }

  props = Array.prototype.slice.call(arguments, pi);

  function ctor() {
    this.constructor = c;
  }

  copy(c, p); // copy static props

  ctor.prototype  = p.prototype;
  c.prototype = new ctor();

  copy(c.prototype, copy.apply(Object, [{}].concat(props)));

  return c;
};

},{"20":20}],23:[function(require,module,exports){
module.exports = function(target) {
  return Object.prototype.toString.call(target) === "[object Array]";
};

},{}],24:[function(require,module,exports){
var Response = require(27);
var isArray  = require(23);

/**
 */

function BufferedResponse(error, chunkValues) {
  Response.call(this, function createWritable(writable) {
    if (error) writable.abort(error);
    chunkValues = isArray(chunkValues) ? chunkValues : chunkValues != void 0 ? [chunkValues] : [];
    chunkValues.forEach(writable.write.bind(writable));
    writable.close();
  });
}

/**
 */

Response.extend(BufferedResponse);

/**
 */

module.exports =  BufferedResponse;

},{"23":23,"27":27}],25:[function(require,module,exports){
var BufferedResponse = require(24);
var extend = require(22);

/**
 */

function EmptyResponse() {
  BufferedResponse.call(this);
}

/**
 */

BufferedResponse.extend(EmptyResponse);

/**
 */

module.exports =  EmptyResponse;

},{"22":22,"24":24}],26:[function(require,module,exports){
var BufferedResponse = require(24);

/**
 */

function ErrorResponse(error) {
  BufferedResponse.call(this, error);
}

/**
 */


BufferedResponse.extend(ErrorResponse);

/**
 */

module.exports =  ErrorResponse;

},{"24":24}],27:[function(require,module,exports){
var WritableStream = require(32);
var extend         = require(22);

/**
 * Creates a new Streamed response
 */

function Response(run) {

  var writer   = this._writer = WritableStream.create();
  this._reader = writer.getReader();

  // todo - pass writable instead
  if (run) {
    // var ret = run(this._writable);
    var ret = run(writer);

    // thenable? Automatically end
    if (ret && ret.then) {
      ret.then(function () {
        writer.close();
      }, writer.abort.bind(writer));
    }
  }
}

/**
 */

extend(Response, {

  /**
   */

  then: function (resolve, reject) {
    return this._writer.then(resolve, reject);
  },

  /**
   */

  catch: function (reject) {
    return this._writer.catch(reject);
  },

  /**
   */

  read: function () {
    return this._reader.read();
  },

  /**
   */

  readAll: function () {
    var self = this;
    var buffer = [];
    // return new
    return new Promise(function run(resolve, reject) {
      self.pipeTo({
        write: buffer.push.bind(buffer),
        close: resolve.bind(self, buffer),
        abort: reject
      });
    });
  },

  /**
   */

  pipeTo: function (writable, options) {
    return this._reader.pipeTo(writable, options);
  },

  /**
   */

  cancel: function () {
    return this._reader.cancel();
  }
});

/**
 */

Response.create = require(21);
Response.extend = extend;

/**
 */

module.exports =  Response;

},{"21":21,"22":22,"32":32}],28:[function(require,module,exports){
var Response = require(27);

/**
 */

function NodeStreamResponse(stream) {

  Response.call(this, function createWritable(writable) {

    if (!stream) return writable.close();

    function pump() {
      stream.resume();
      stream.once('data', function(data) {
        stream.pause();
        writable.write(data).then(pump);
      });
    }

    function end() {
      writable.close();
    }

    stream
    .once('end', end)
    .once('error', writable.abort.bind(writable));

    pump();
  });
}

/**
 */

Response.extend(NodeStreamResponse);

/**
 */

module.exports =  NodeStreamResponse;

},{"27":27}],29:[function(require,module,exports){
var Response         = require(27);
var BufferedResponse = require(24);
var EmptyResponse    = require(25);

/**
 */

module.exports =  {
  create: function() {

    var arg1 = arguments[0];

    if (typeof arg1 !== 'undefined') {

      // is it a stream?
      if (arg1.read) return arg1;

      // is it a promise?
      if (arg1.then) {
        return Response.create(function(writable) {
          arg1.then(function resolve(value) {
            if (value != void 0) writable.write(value);
            writable.close();
          }, writable.abort.bind(writable));
        });
      }

      return BufferedResponse.create.apply(
        BufferedResponse,
        [void 0].concat(Array.prototype.slice.call(arguments))
      );
    }

    return EmptyResponse.create();
  }
};

},{"24":24,"25":25,"27":27}],30:[function(require,module,exports){
var extend = require(22);

/**
 */

function PassThrough() {
  var self = this;
  this._values = [];
  this._promise = new Promise(function run(resolve, reject) {
    self._resolve = resolve;
    self._reject  = reject;
  });
}

/**
 */

extend(PassThrough, {

  /**
   */

  then: function (resolve, reject) {
    return this._promise.then(resolve, reject);
  },

  /**
   */

  __signalWrite: function () {
  },

  /**
   */

  __signalRead: function () {
  },

  /**
   */

  write: function (value) {
    var self = this;

    if (this._closed) {
      return Promise.reject(new Error('cannot write to a closed stream'));
    }

    this._values.push(value);
    this.__signalWrite();
    return new Promise(function run(resolve, reject) {
      self.__signalRead = function () {
        self.__signalRead = function () { };
        resolve();
      };
    });
  },

  /**
   */

  read: function () {
    var self = this;
    this.__signalRead();

    if (this._error) {
      return Promise.reject(this._error);
    }

    if (!!this._values.length) {
      return Promise.resolve({ value: this._values.shift(), done: false });
    }

    if (this._closed) {
      return Promise.resolve({ value: void 0, done: true });
    }

    return new Promise(function run(resolve, reject) {
      self.__signalWrite = function () {
        self.__signalWrite = function () { };
        self.read().then(resolve, reject);
      };
    });
  },

  /**
   */

  abort: function (error) {
    this._error = error;
    this._reject(error);
    this.__signalWrite();
  },

  /**
   */

  close: function () {
    this._closed = true;
    this._resolve();
    this.__signalWrite();
  }
});

/**
 */

PassThrough.create = require(21);

/**
 */

module.exports = PassThrough;

},{"21":21,"22":22}],31:[function(require,module,exports){
var extend = require(22);

/**
 */

function ReadableStream(passThrough) {
  this._passThrough = passThrough;
}

/**
 */

extend(ReadableStream, {

  /**
   */

  read: function () {
    return this._passThrough.read();
  },

  /**
   */

  pipeTo: function (writable, options) {
    if (!options) options = {};
    var self = this;
    function pump() {
      self.read().then(function resolve(item) {
        if (item.done) {
          if (!options.preventClose) writable.close();
        } else {
          writable.write(item.value);
          pump();
        }
      }, options.preventAbort ? void 0 : writable.abort.bind(writable));
    }
    pump();
    return writable;
  },

  /**
   */

  cancel: function() {
    return this._passThrough.close();
  }
});

/**
 */

ReadableStream.create = require(21);

/**
 */

module.exports = ReadableStream;

},{"21":21,"22":22}],32:[function(require,module,exports){
var extend = require(22);
var PassThrough = require(30);
var ReadableStream = require(31);

/**
 */

function WritableStream(options) {
  this._passThrough = PassThrough.create();
  this._reader = ReadableStream.create(this._passThrough);
}

/**
 */

extend(WritableStream, {

  /**
   */

  then: function(resolve, reject) {
    return this._passThrough.then(resolve, reject);
  },

  /**
   */

  catch: function(reject) {
    return this.then(void 0, reject);
  },

  /**
   */

  write: function(chunk) {
    return this._passThrough.write(chunk);
  },

  /**
   */

  abort: function(error) {
    this._passThrough.abort(error);
  },

  /**
   */

  close: function() {
    this._passThrough.close();
  },

  /**
   */

  getReader: function() {
    return this._reader;
  }
});

/**
 */

WritableStream.create = require(21);
WritableStream.extend = require(22);

/**
 */

module.exports = WritableStream;

},{"21":21,"22":22,"30":30,"31":31}]},{},[19]);
