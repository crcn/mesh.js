(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Bus = require(3);
var NoopBus = require(9);
var Response = require(26);

/**
 */

function AcceptBus(filter, acceptBus, rejectBus) {
  this._filter = filter;
  this._acceptBus = acceptBus || NoopBus.create();
  this._rejectBus = rejectBus || NoopBus.create();
}

/**
 */

Bus.extend(AcceptBus, {

  /**
   */

  execute: function (operation) {
    var accepted = this._filter(operation);

    if (accepted && accepted.then) {
      return Response.create(writable => {
        accepted.then(yes => {
          this._execute(yes, operation).pipeTo(writable);
        }, writable.abort.bind(writable));
      });
    }

    return this._execute(accepted, operation);
  },

  /**
   */

  _execute: function (yes, operation) {
    return yes ? this._acceptBus.execute(operation) : this._rejectBus.execute(operation);
  }
});

/**
 */

module.exports = AcceptBus;

},{"26":26,"3":3,"9":9}],2:[function(require,module,exports){
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
  this._bus = bus;
}

/**
 */

Bus.extend(AttachDefaultsBus, {
  execute: function (operation) {
    return this._bus.execute(_defaults(operation, this._properties));
  }
});

/**
 */

module.exports = AttachDefaultsBus;

},{"3":3}],3:[function(require,module,exports){
var extend = require(21);

/**
 */

function Bus() {}

/**
 */

extend(Bus, {

  /**
   */

  execute: function (operation) {
    // OVERRIDE ME
  }
});

/**
 */

Bus.create = require(20);
Bus.extend = extend;

/**
 */

module.exports = Bus;

},{"20":20,"21":21}],4:[function(require,module,exports){
var Bus = require(3);
var BufferedResponse = require(23);

/**
 */

function BufferedBus(error, chunkValues) {
  this._error = error;
  this._chunkValues = chunkValues;
}

/**
 */

Bus.extend(BufferedBus, {

  /**
   */

  execute: function (operation) {
    return BufferedResponse.create(this._error, this._chunkValues);
  }
});

/**
 */

module.exports = BufferedBus;

},{"23":23,"3":3}],5:[function(require,module,exports){
var Bus = require(3);
var Response = require(26);

/**
 */

function CatchErrorBus(bus, catchError) {
  this._bus = bus;
  this._catchError = catchError;
}

/**
 */

Bus.extend(CatchErrorBus, {

  /**
   */

  execute: function (operation) {
    return Response.create(writable => {

      this._bus.execute(operation).pipeTo({
        write: value => {
          writable.write(value);
        },
        close: () => {
          writable.close();
        },
        abort: error => {
          try {
            var p = this._catchError(error, operation);
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

module.exports = CatchErrorBus;

},{"26":26,"3":3}],6:[function(require,module,exports){
var Bus = require(3);
var Response = require(26);

/**
 */

function DelayedBus(bus, ms) {
  this._ms = ms;
  this._bus = bus;
}

/**
 */

Bus.extend(DelayedBus, {
  execute: function (operation) {
    return Response.create(writable => {
      setTimeout(() => {
        this._bus.execute(operation).pipeTo(writable);
      }, this._ms);
    });
  }
});

/**
 */

module.exports = DelayedBus;

},{"26":26,"3":3}],7:[function(require,module,exports){
var Bus = require(3);
var Response = require(26);

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

  execute: function (operation) {
    return Response.create(writable => {
      var busses = this._busses.concat();
      var next = i => {
        if (i === busses.length) return writable.close();
        var response = busses[i].execute(operation);
        var hasChunk = false;
        response.pipeTo({
          write: function (value) {
            hasChunk = true;
            writable.write(value);
          },
          close: function () {
            if (hasChunk) {
              writable.close();
            } else {
              next(i + 1);
            }
          },
          abort: writable.abort.bind(writable)
        });
      };
      next(0);
    });
  }
});

/**
 */

module.exports = FallbackBus;

},{"26":26,"3":3}],8:[function(require,module,exports){
var Bus = require(3);
var Response = require(26);

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

  execute: function (operation) {
    return Response.create(writable => {

      this._bus.execute(operation).pipeTo({
        write: value => {
          try {
            this._map(value, writable, operation);
          } catch (e) {
            writable.abort(e);
            return Promise.reject(e);
          }
        },
        close: () => {
          writable.close();
        },
        abort: writable.abort.bind(writable)
      });
    });
  }
});

/**
 */

module.exports = MapBus;

},{"26":26,"3":3}],9:[function(require,module,exports){
var Bus = require(3);
var EmptyResponse = require(24);

/**
 */

function NoopBus() {}

/**
 */

Bus.extend(NoopBus, {

  /**
   */

  execute: function (operation) {
    return EmptyResponse.create();
  }
});

/**
 */

module.exports = NoopBus;

},{"24":24,"3":3}],10:[function(require,module,exports){
var Bus = require(3);
var Response = require(26);

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

  execute: function (operation) {
    return Response.create(writable => {

      var busses = this._busses.concat();
      var numLeft = busses.length;

      busses.forEach(bus => {
        var resp = bus.execute(operation);
        resp.pipeTo(writable, { preventClose: true });
        resp.then(() => {
          if (! --numLeft) writable.close();
        });
      });
    });
  }
});

/**
 */

module.exports = ParallelBus;

},{"26":26,"3":3}],11:[function(require,module,exports){
var Bus = require(3);
var Response = require(26);

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

  execute: function (operation) {
    return Response.create(writable => {
      var busses = this._busses.concat();
      var numLeft = busses.length;
      var found = -1;
      busses.forEach((bus, i) => {
        var response = bus.execute(operation);

        response.pipeTo({
          write: function (value) {
            if (~found && found !== i) return;
            found = i;
            writable.write(value);
          },
          close: function () {
            if (~found && found === i || --numLeft === 0) {
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

module.exports = RaceBus;

},{"26":26,"3":3}],12:[function(require,module,exports){
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

  execute: function (operation) {
    return this._busses[Math.floor(Math.random() * this._busses.length)].execute(operation);
  }
});

/**
 */

module.exports = RandomBus;

},{"3":3}],13:[function(require,module,exports){
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

module.exports = RejectBus;

},{"1":1}],14:[function(require,module,exports){
var Bus = require(3);
var Response = require(26);

/**
 */

function RetryBus(maxRetries, errorFilter, bus) {

  if (arguments.length === 2) {
    bus = errorFilter;
    errorFilter = function (error, operation) {
      return true;
    };
  }

  this._maxRetries = maxRetries;
  this._bus = bus;
  this._errorFilter = errorFilter;
}

/**
 */

Bus.extend(RetryBus, {

  /**
   */

  execute: function (operation) {
    return Response.create(writable => {
      var hasChunk = false;
      var prevError;

      var run = triesLeft => {
        if (!triesLeft) return writable.abort(prevError);
        var response = this._bus.execute(operation);
        response.pipeTo({
          write: function (value) {
            hasChunk = true;
            writable.write(value);
          },
          close: function () {
            writable.close();
          },
          abort: function (error) {
            prevError = error;
            run(triesLeft - 1);
          }
        });
      };

      run(this._maxRetries);
    });
  }
});

/**
 */

module.exports = RetryBus;

},{"26":26,"3":3}],15:[function(require,module,exports){
var Bus = require(3);

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

  execute: function (operation) {
    var ret = this._busses[this._i].execute(operation);
    this._i = (this._i + 1) % this._busses.length;
    return ret;
  }
});

/**
 */

module.exports = RoundRobinBus;

},{"3":3}],16:[function(require,module,exports){
var Bus = require(3);
var Response = require(26);

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

  execute: function (operation) {
    return Response.create(writable => {

      // copy incase the collection mutates (unlikely but possible)
      var busses = this._busses.concat();

      var next = i => {
        if (i === busses.length) return writable.close();
        var resp = busses[i].execute(operation);
        resp.pipeTo(writable, { preventClose: true });
        resp.then(() => next(i + 1));
      };

      next(0);
    });
  }
});

/**
 */

module.exports = SequenceBus;

},{"26":26,"3":3}],17:[function(require,module,exports){
var Bus = require(3);
var extend = require(21);
var Response = require(26);
var BufferedResponse = require(23);

/**
*/

function WrapBus(execute) {

  // node style? (next(err, result))
  if (execute.length >= 2) {
    this._execute = function (operation) {
      return new Promise((resolve, reject) => {
        execute(operation, function (err, result) {
          if (err) return reject(err);
          resolve.apply(this, Array.prototype.slice.call(arguments, 1));
        });
      });
    };
  } else {
    this._execute = execute;
  }
}

/**
*/

extend(Bus, WrapBus, {

  /**
   */

  execute: function (operation) {
    var ret = this._execute(operation);

    // is a readable stream
    if (ret && ret.read) return ret;
    if (!ret || !ret.then) return BufferedResponse.create(void 0, ret);
    if (ret.then) return Response.create(function (writable) {
      ret.then(value => {
        if (value != void 0) writable.write(value);
        writable.close();
      }, writable.abort.bind(writable));
    });
  }
});

/**
*/

module.exports = WrapBus;

},{"21":21,"23":23,"26":26,"3":3}],18:[function(require,module,exports){

module.exports = {

  /**
   * busses
   */

  Bus: require(3),
  MapBus: require(8),
  NoopBus: require(9),
  WrapBus: require(17),
  RaceBus: require(11),
  RetryBus: require(14),
  RandomBus: require(12),
  AcceptBus: require(1),
  RejectBus: require(13),
  DelayedBus: require(6),
  SequenceBus: require(16),
  ParallelBus: require(10),
  BufferedBus: require(4),
  FallbackBus: require(7),
  CatchErrorBus: require(5),
  RoundRobinBus: require(15),
  AttachDefaultsBus: require(2),

  // TODO
  // ReduceBus:require('./bus/reduce'),

  /**
   * responses
   */

  Response: require(26),
  EmptyResponse: require(24),
  ErrorResponse: require(25),
  BufferedResponse: require(23),
  NodeStreamResponse: require(27),

  /**
   */

  WritableStream: require(30)
};

if (typeof window !== 'undefined') {

  module.exports.noConflict = function () {
    delete window.mesh;
    return module.exports;
  };

  window.mesh = module.exports;
}

},{"1":1,"10":10,"11":11,"12":12,"13":13,"14":14,"15":15,"16":16,"17":17,"2":2,"23":23,"24":24,"25":25,"26":26,"27":27,"3":3,"30":30,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9}],19:[function(require,module,exports){
module.exports = function (to) {
  var fromObjects = Array.prototype.slice.call(arguments, 1);
  for (var i = 0, n = fromObjects.length; i < n; i++) {
    var fm = fromObjects[i];
    for (var key in fm) {
      to[key] = fm[key];
    }
  }
  return to;
};

},{}],20:[function(require,module,exports){
module.exports = function () {
  var object = Object.create(this.prototype);
  this.apply(object, arguments);
  return object;
};

},{}],21:[function(require,module,exports){
var copy = require(19);

/**
 * IE8+ compatible subclassing. See https://babeljs.io/docs/advanced/caveats/
 */

module.exports = function (parent, child) {

  var props;
  var pi;

  var c = child;
  var p = parent;

  if (typeof c === 'function') {
    pi = 2;
  } else {
    if (typeof p === 'object') {
      c = function () {
        p.apply(this, arguments);
      };
      pi = 0;
    } else {
      c = p || function () {};
      pi = 1;
    }

    p = typeof this === 'function' ? this : Object;
  }

  props = Array.prototype.slice.call(arguments, pi);

  function ctor() {
    this.constructor = c;
  }

  copy(c, p); // copy static props

  ctor.prototype = p.prototype;
  c.prototype = new ctor();

  copy(c.prototype, copy.apply(Object, [{}].concat(props)));

  return c;
};

},{"19":19}],22:[function(require,module,exports){
module.exports = function (target) {
  return Object.prototype.toString.call(target) === "[object Array]";
};

},{}],23:[function(require,module,exports){
var Response = require(26);
var isArray = require(22);

/**
 */

function BufferedResponse(error, chunkValues) {
  Response.call(this, function (writable) {
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

module.exports = BufferedResponse;

},{"22":22,"26":26}],24:[function(require,module,exports){
var BufferedResponse = require(23);
var extend = require(21);

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

module.exports = EmptyResponse;

},{"21":21,"23":23}],25:[function(require,module,exports){
var BufferedResponse = require(23);

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

module.exports = ErrorResponse;

},{"23":23}],26:[function(require,module,exports){
var WritableStream = require(30);
var extend = require(21);

/**
 * Creates a new Streamed response
 */

function Response(run) {

  var writer = this._writer = WritableStream.create();
  this._reader = writer.getReader();

  // todo - pass writable instead
  if (run) {
    // var ret = run(this._writable);
    var ret = run(writer);

    // thenable? Automatically end
    if (ret && ret.then) {
      ret.then(() => {
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
    var buffer = [];
    // return new
    return new Promise((resolve, reject) => {
      this.pipeTo({
        write: buffer.push.bind(buffer),
        close: resolve.bind(this, buffer),
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

Response.create = require(20);
Response.extend = extend;

/**
 */

module.exports = Response;

},{"20":20,"21":21,"30":30}],27:[function(require,module,exports){
var Response = require(26);

/**
 */

function NodeStreamResponse(stream) {

  Response.call(this, writable => {

    if (!stream) return writable.close();

    var pump = () => {
      stream.resume();
      stream.once('data', function (data) {
        stream.pause();
        writable.write(data).then(pump);
      });
    };

    var end = () => {
      writable.close();
    };

    stream.once('end', end).once('error', writable.abort.bind(writable));

    pump();
  });
}

/**
 */

Response.extend(NodeStreamResponse);

/**
 */

module.exports = NodeStreamResponse;

},{"26":26}],28:[function(require,module,exports){
var extend = require(21);

/**
 */

function PassThrough() {
  this._values = [];
  this._promise = new Promise((resolve, reject) => {
    this._resolve = resolve;
    this._reject = reject;
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

  __signalWrite: function () {},

  /**
   */

  __signalRead: function () {},

  /**
   */

  write: function (value) {

    if (this._closed) {
      return Promise.reject(new Error('cannot write to a closed stream'));
    }

    this._values.push(value);
    this.__signalWrite();
    return new Promise((resolve, reject) => {
      this.__signalRead = () => {
        this.__signalRead = () => {};
        resolve();
      };
    });
  },

  /**
   */

  read: function () {
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

    return new Promise((resolve, reject) => {
      this.__signalWrite = () => {
        this.__signalWrite = () => {};
        this.read().then(resolve, reject);
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

PassThrough.create = require(20);

/**
 */

module.exports = PassThrough;

},{"20":20,"21":21}],29:[function(require,module,exports){
var extend = require(21);

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
    var pump = () => {
      this.read().then(item => {
        if (item.done) {
          if (!options.preventClose) writable.close();
        } else {
          writable.write(item.value);
          pump();
        }
      }, options.preventAbort ? void 0 : writable.abort.bind(writable));
    };
    pump();
    return writable;
  },

  /**
   */

  cancel: function () {
    return this._passThrough.close();
  }
});

/**
 */

ReadableStream.create = require(20);

/**
 */

module.exports = ReadableStream;

},{"20":20,"21":21}],30:[function(require,module,exports){
var extend = require(21);
var PassThrough = require(28);
var ReadableStream = require(29);

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

  then: function (resolve, reject) {
    return this._passThrough.then(resolve, reject);
  },

  /**
   */

  catch: function (reject) {
    return this.then(void 0, reject);
  },

  /**
   */

  write: function (chunk) {
    return this._passThrough.write(chunk);
  },

  /**
   */

  abort: function (error) {
    this._passThrough.abort(error);
  },

  /**
   */

  close: function () {
    this._passThrough.close();
  },

  /**
   */

  getReader: function () {
    return this._reader;
  }
});

/**
 */

WritableStream.create = require(20);
WritableStream.extend = require(21);

/**
 */

module.exports = WritableStream;

},{"20":20,"21":21,"28":28,"29":29}]},{},[18]);
