var extend = require('../internal/extend');

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

PassThrough.create = require('../internal/create-object');

/**
 */

module.exports = PassThrough;
