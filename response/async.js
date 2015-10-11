var Response = require("./base");
var extend = require("../internal/extend");

/**
 * TODO - break this out into writable stream
 */

function AsyncResponse(run) {
  Response.call(this);
  this._chunks = [];
  this._errors = [];

  // todo - pass writable instead
  if (run) run(this);
}

/**
 */

extend(Response, AsyncResponse, {

  /**
   * super private
   */

  __signalWrite: function() { },

  /**
   * super private
   */

  __signalRead: function() { },

  /**
   */

  read: function() {

    this.__signalRead();

    if (!!this._errors.length) {
      var error = this._errors.shift();
      return Promise.reject(error);
    }

    if (!!this._chunks.length) {
      var chunk = this._chunks.shift();
      return Promise.resolve(chunk);
    }

    if (this._ended) {
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

  error: function(error) {
    this._errors.push(error);
    this.__signalWrite();
  },

  /**
   */

  write: function(value) {
    return new Promise((resolve, reject) => {

      this.__signalRead = () => {
        this.__signalRead = () => { };
        resolve();
      }

      this._writeChunk({ value: value, done: false });
    })
  },

  /**
   */

  end: function(chunk) {

    if (chunk != void 0) {
      this.write(chunk);
    }

    this._ended = true;
    this.__signalWrite();
  },

  /**
   */

  _writeChunk: function(chunk) {
    this._chunks.push(chunk);
    this.__signalWrite();
  }
});

/**
 */

module.exports =  AsyncResponse;
