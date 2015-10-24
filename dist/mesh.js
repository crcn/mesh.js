(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = {

  /**
   * busses
   */

  Bus: require(4),
  MapBus: require(9),
  NoopBus: require(10),
  WrapBus: require(19),
  RaceBus: require(12),
  RetryBus: require(15),
  RandomBus: require(13),
  AcceptBus: require(2),
  RejectBus: require(14),
  DelayedBus: require(7),
  SequenceBus: require(17),
  ParallelBus: require(11),
  BufferedBus: require(5),
  FallbackBus: require(8),
  TailableBus: require(18),
  CatchErrorBus: require(6),
  RoundRobinBus: require(16),
  AttachDefaultsBus: require(3),

  // TODO
  // ReduceBus:require('./bus/reduce'),

  /**
   * responses
   */

  Response: require(27),
  EmptyResponse: require(25),
  ErrorResponse: require(26),
  BufferedResponse: require(24),
  NodeStreamResponse: require(28),

  /**
   */

  WritableStream: require(31)
};

if (typeof window !== 'undefined') {

  module.exports.noConflict = function () {
    delete window.mesh;
    return module.exports;
  };

  window.mesh = module.exports;
}

},{"10":10,"11":11,"12":12,"13":13,"14":14,"15":15,"16":16,"17":17,"18":18,"19":19,"2":2,"24":24,"25":25,"26":26,"27":27,"28":28,"3":3,"31":31,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9}],2:[function(require,module,exports){
'use strict';

var Bus = require(4);
var NoopBus = require(10);
var Response = require(27);

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

  execute: function execute(operation) {
    var _this = this;

    var accepted = this._filter(operation);

    if (accepted && accepted.then) {
      return Response.create(function (writable) {
        accepted.then(function (yes) {
          _this._execute(yes, operation).pipeTo(writable);
        }, writable.abort.bind(writable));
      });
    }

    return this._execute(accepted, operation);
  },

  /**
   */

  _execute: function _execute(yes, operation) {
    return yes ? this._acceptBus.execute(operation) : this._rejectBus.execute(operation);
  }
});

/**
 */

module.exports = AcceptBus;

},{"10":10,"27":27,"4":4}],3:[function(require,module,exports){
'use strict';

var Bus = require(4);

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
  execute: function execute(operation) {
    return this._bus.execute(_defaults(operation, this._properties));
  }
});

/**
 */

module.exports = AttachDefaultsBus;

},{"4":4}],4:[function(require,module,exports){
'use strict';

var extend = require(22);

/**
 */

function Bus() {}

/**
 */

extend(Bus, {

  /**
   */

  execute: function execute(operation) {
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

},{"21":21,"22":22}],5:[function(require,module,exports){
'use strict';

var Bus = require(4);
var BufferedResponse = require(24);

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

  execute: function execute(operation) {
    return BufferedResponse.create(this._error, this._chunkValues);
  }
});

/**
 */

module.exports = BufferedBus;

},{"24":24,"4":4}],6:[function(require,module,exports){
'use strict';

var Bus = require(4);
var Response = require(27);

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

  execute: function execute(operation) {
    var _this = this;

    return Response.create(function (writable) {

      _this._bus.execute(operation).pipeTo({
        write: function write(value) {
          writable.write(value);
        },
        close: function close() {
          writable.close();
        },
        abort: function abort(error) {
          try {
            var p = _this._catchError(error, operation);
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

},{"27":27,"4":4}],7:[function(require,module,exports){
'use strict';

var Bus = require(4);
var Response = require(27);

/**
 */

function DelayedBus(bus, ms) {
  this._ms = ms;
  this._bus = bus;
}

/**
 */

Bus.extend(DelayedBus, {
  execute: function execute(operation) {
    var _this = this;

    return Response.create(function (writable) {
      setTimeout(function () {
        _this._bus.execute(operation).pipeTo(writable);
      }, _this._ms);
    });
  }
});

/**
 */

module.exports = DelayedBus;

},{"27":27,"4":4}],8:[function(require,module,exports){
'use strict';

var Bus = require(4);
var Response = require(27);

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

  execute: function execute(operation) {
    var _this = this;

    return Response.create(function (writable) {
      var busses = _this._busses.concat();
      var next = function next(i) {
        if (i === busses.length) return writable.close();
        var response = busses[i].execute(operation);
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
      };
      next(0);
    });
  }
});

/**
 */

module.exports = FallbackBus;

},{"27":27,"4":4}],9:[function(require,module,exports){
'use strict';

var Bus = require(4);
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

  execute: function execute(operation) {
    var _this = this;

    return Response.create(function (writable) {

      _this._bus.execute(operation).pipeTo({
        write: function write(value) {
          try {
            _this._map(value, writable, operation);
          } catch (e) {
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

module.exports = MapBus;

},{"27":27,"4":4}],10:[function(require,module,exports){
'use strict';

var Bus = require(4);
var EmptyResponse = require(25);

/**
 */

function NoopBus() {}

/**
 */

Bus.extend(NoopBus, {

  /**
   */

  execute: function execute(operation) {
    return EmptyResponse.create();
  }
});

/**
 */

module.exports = NoopBus;

},{"25":25,"4":4}],11:[function(require,module,exports){
'use strict';

var Bus = require(4);
var Response = require(27);

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

  execute: function execute(operation) {
    var _this = this;

    return Response.create(function (writable) {

      var busses = _this._busses.concat();
      var numLeft = busses.length;

      busses.forEach(function (bus) {
        var resp = bus.execute(operation);
        resp.pipeTo(writable, { preventClose: true });
        resp.then(function () {
          if (! --numLeft) writable.close();
        });
      });
    });
  }
});

/**
 */

module.exports = ParallelBus;

},{"27":27,"4":4}],12:[function(require,module,exports){
'use strict';

var Bus = require(4);
var Response = require(27);

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

  execute: function execute(operation) {
    var _this = this;

    return Response.create(function (writable) {
      var busses = _this._busses.concat();
      var numLeft = busses.length;
      var found = -1;
      busses.forEach(function (bus, i) {
        var response = bus.execute(operation);

        response.pipeTo({
          write: function write(value) {
            if (~found && found !== i) return;
            found = i;
            writable.write(value);
          },
          close: function close() {
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

},{"27":27,"4":4}],13:[function(require,module,exports){
'use strict';

var Bus = require(4);

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

  execute: function execute(operation) {
    return this._busses[Math.floor(Math.random() * this._busses.length)].execute(operation);
  }
});

/**
 */

module.exports = RandomBus;

},{"4":4}],14:[function(require,module,exports){
'use strict';

var AcceptBus = require(2);

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

},{"2":2}],15:[function(require,module,exports){
'use strict';

var Bus = require(4);
var Response = require(27);

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

  execute: function execute(operation) {
    var _this = this;

    return Response.create(function (writable) {
      var hasChunk = false;
      var prevError;

      var run = function run(triesLeft) {
        if (!triesLeft) return writable.abort(prevError);
        var response = _this._bus.execute(operation);
        response.pipeTo({
          write: function write(value) {
            hasChunk = true;
            writable.write(value);
          },
          close: function close() {
            writable.close();
          },
          abort: function abort(error) {
            prevError = error;
            run(triesLeft - 1);
          }
        });
      };

      run(_this._maxRetries);
    });
  }
});

/**
 */

module.exports = RetryBus;

},{"27":27,"4":4}],16:[function(require,module,exports){
'use strict';

var Bus = require(4);

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

  execute: function execute(operation) {
    var ret = this._busses[this._i].execute(operation);
    this._i = (this._i + 1) % this._busses.length;
    return ret;
  }
});

/**
 */

module.exports = RoundRobinBus;

},{"4":4}],17:[function(require,module,exports){
'use strict';

var Bus = require(4);
var Response = require(27);

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

  execute: function execute(operation) {
    var _this = this;

    return Response.create(function (writable) {

      // copy incase the collection mutates (unlikely but possible)
      var busses = _this._busses.concat();

      var next = function next(i) {
        if (i === busses.length) return writable.close();
        var resp = busses[i].execute(operation);
        resp.pipeTo(writable, { preventClose: true });
        resp.then(function () {
          return next(i + 1);
        });
      };

      next(0);
    });
  }
});

/**
 */

module.exports = SequenceBus;

},{"27":27,"4":4}],18:[function(require,module,exports){
'use strict';

var Bus = require(4);
var Response = require(27);

/**
 */

function TailableBus(bus) {
  this._bus = bus;
  this._tails = [];
}

/**
 */

Bus.extend(TailableBus, {

  /**
   */

  addTail: function addTail(operation) {
    var _this = this;

    return Response.create(function (writable) {
      _this._tails.push(writable);
      writable.then(function () {
        _this._tails.splice(_this._tails.indexOf(writable), 1);
      });
    });
  },

  /**
   */

  execute: function execute(operation) {
    var _this2 = this;

    var response = this._bus.execute(operation);

    response.then(function () {
      _this2._tails.forEach(function (tail) {
        tail.write(operation);
      });
    });

    return response;
  }
});

/**
 */

module.exports = TailableBus;

},{"27":27,"4":4}],19:[function(require,module,exports){
'use strict';

var Bus = require(4);
var extend = require(22);
var Response = require(27);
var BufferedResponse = require(24);

/**
*/

function WrapBus(execute) {

  // node style? (next(err, result))
  if (execute.length >= 2) {
    this._execute = function (operation) {
      return new Promise(function (resolve, reject) {
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

  execute: function execute(operation) {
    var ret = this._execute(operation);

    // is a readable stream
    if (ret && ret.read) return ret;
    if (!ret || !ret.then) return BufferedResponse.create(void 0, ret);
    if (ret.then) return Response.create(function (writable) {
      ret.then(function (value) {
        if (value != void 0) writable.write(value);
        writable.close();
      }, writable.abort.bind(writable));
    });
  }
});

/**
*/

module.exports = WrapBus;

},{"22":22,"24":24,"27":27,"4":4}],20:[function(require,module,exports){
"use strict";

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

},{}],21:[function(require,module,exports){
"use strict";

module.exports = function () {
  var object = Object.create(this.prototype);
  this.apply(object, arguments);
  return object;
};

},{}],22:[function(require,module,exports){
'use strict';

var copy = require(20);

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
      c = function () {};
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

},{"20":20}],23:[function(require,module,exports){
"use strict";

module.exports = function (target) {
  return Object.prototype.toString.call(target) === "[object Array]";
};

},{}],24:[function(require,module,exports){
'use strict';

var Response = require(27);
var isArray = require(23);

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

},{"23":23,"27":27}],25:[function(require,module,exports){
'use strict';

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

module.exports = EmptyResponse;

},{"22":22,"24":24}],26:[function(require,module,exports){
'use strict';

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

module.exports = ErrorResponse;

},{"24":24}],27:[function(require,module,exports){
'use strict';

var WritableStream = require(31);
var extend = require(22);

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

  then: function then(resolve, reject) {
    return this._writer.then(resolve, reject);
  },

  /**
   */

  'catch': function _catch(reject) {
    return this._writer['catch'](reject);
  },

  /**
   */

  read: function read() {
    return this._reader.read();
  },

  /**
   */

  readAll: function readAll() {
    var _this = this;

    var buffer = [];
    // return new
    return new Promise(function (resolve, reject) {
      _this.pipeTo({
        write: buffer.push.bind(buffer),
        close: resolve.bind(_this, buffer),
        abort: reject
      });
    });
  },

  /**
   */

  pipeTo: function pipeTo(writable, options) {
    return this._reader.pipeTo(writable, options);
  },

  /**
   */

  cancel: function cancel() {
    return this._reader.cancel();
  }
});

/**
 */

Response.create = require(21);
Response.extend = extend;

/**
 */

module.exports = Response;

},{"21":21,"22":22,"31":31}],28:[function(require,module,exports){
'use strict';

var Response = require(27);

/**
 */

function NodeStreamResponse(stream) {

  Response.call(this, function (writable) {

    if (!stream) return writable.close();

    var pump = function pump() {
      stream.resume();
      stream.once('data', function (data) {
        stream.pause();
        writable.write(data).then(pump);
      });
    };

    var end = function end() {
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

},{"27":27}],29:[function(require,module,exports){
'use strict';

var extend = require(22);

/**
 */

function PassThrough() {
  var _this = this;

  this._values = [];
  this._promise = new Promise(function (resolve, reject) {
    _this._resolve = resolve;
    _this._reject = reject;
  });
}

/**
 */

extend(PassThrough, {

  /**
   */

  then: function then(resolve, reject) {
    return this._promise.then(resolve, reject);
  },

  /**
   */

  __signalWrite: function __signalWrite() {},

  /**
   */

  __signalRead: function __signalRead() {},

  /**
   */

  write: function write(value) {
    var _this2 = this;

    if (this._closed) {
      return Promise.reject(new Error('cannot write to a closed stream'));
    }

    this._values.push(value);
    this.__signalWrite();
    return new Promise(function (resolve, reject) {
      _this2.__signalRead = function () {
        _this2.__signalRead = function () {};
        resolve();
      };
    });
  },

  /**
   */

  read: function read() {
    var _this3 = this;

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

    return new Promise(function (resolve, reject) {
      _this3.__signalWrite = function () {
        _this3.__signalWrite = function () {};
        _this3.read().then(resolve, reject);
      };
    });
  },

  /**
   */

  abort: function abort(error) {
    this._error = error;
    this._reject(error);
    this.__signalWrite();
  },

  /**
   */

  close: function close() {
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

},{"21":21,"22":22}],30:[function(require,module,exports){
'use strict';

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

  read: function read() {
    return this._passThrough.read();
  },

  /**
   */

  pipeTo: function pipeTo(writable, options) {
    var _this = this;

    if (!options) options = {};
    var pump = function pump() {
      _this.read().then(function (item) {
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

  cancel: function cancel() {
    return this._passThrough.close();
  }
});

/**
 */

ReadableStream.create = require(21);

/**
 */

module.exports = ReadableStream;

},{"21":21,"22":22}],31:[function(require,module,exports){
'use strict';

var extend = require(22);
var PassThrough = require(29);
var ReadableStream = require(30);

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

  then: function then(resolve, reject) {
    return this._passThrough.then(resolve, reject);
  },

  /**
   */

  'catch': function _catch(reject) {
    return this.then(void 0, reject);
  },

  /**
   */

  write: function write(chunk) {
    return this._passThrough.write(chunk);
  },

  /**
   */

  abort: function abort(error) {
    this._passThrough.abort(error);
  },

  /**
   */

  close: function close() {
    this._passThrough.close();
  },

  /**
   */

  getReader: function getReader() {
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

},{"21":21,"22":22,"29":29,"30":30}]},{},[1]);
