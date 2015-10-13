var Response = require("./base");
var extend = require("../internal/extend");
var Chunk = require("../internal/chunk");

/**
 * Creates a new Streamed response
 */

function AsyncResponse(run) {
  Response.call(this);
  this._chunks = [];

  // todo - pass writable instead
  if (run) {
    var ret = run(this);

    // thenable? Automatically end
    if (ret && ret.then) {
      ret.then(() => {
        this.end();
      }, this.error.bind(this));
    }
  }
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

    // if there is an error, always fail
    if (!!this._error) {
      return Promise.reject(this._error);
    }

    if (!!this._chunks.length) {
      var chunk = this._chunks.shift();
      return Promise.resolve(chunk);
    }

    if (this._ended) {
      this._resolve();
      return Promise.resolve(new Chunk(void 0, true));
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
    this._error = error;
    this._reject(error); // fin
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

      this._writeChunk(new Chunk(value, false));
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
