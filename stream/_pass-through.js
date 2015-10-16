var extend = require('../internal/extend');

/**
 */

function PassThrough() {
  this._values = [];
  this._promise = new Promise((resolve, reject) => {
    this._resolve = resolve;
    this._reject  = reject;
  });
}

/**
 */

extend(PassThrough, {

  /**
   */

  then: function(resolve, reject) {
    return this._promise.then(resolve, reject);
  },

  /**
   */

  __signalWrite: function() {
  },

  /**
   */

  __signalRead: function() {
  },

  /**
   */

  write: function(value) {
    this._values.push(value);
    this.__signalWrite();
    return new Promise((resolve, reject) => {
      this.__signalRead = () => {
        this.__signalRead = () => { };
        resolve();
      }
    });
  },

  /**
   */

  read: function() {
    this.__signalRead();

    if (this._error) {
      this._reject(this._error);
      return Promise.reject(this._error);
    }

    if (!!this._values.length) {
      return Promise.resolve({ value: this._values.shift(), done: false });
    }

    if (this._closed) {
      this._resolve();
      return Promise.resolve({ value: void 0, done: true });
    }

    return new Promise((resolve, reject) => {
      this.__signalWrite = () => {
        this.__signalWrite = () => { };
        this.read().then(resolve, reject);
      };
    });
  },

  /**
   */

  abort: function(error) {
    this._error = error;
    this.__signalWrite();
  },

  /**
   */

  end: function() {
    this._closed = true;
    this.__signalWrite();
  }
});

/**
 */

PassThrough.create = require('../internal/create-object');

/**
 */

module.exports = PassThrough;
