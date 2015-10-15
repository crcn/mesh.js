var extend = require('../internal/extend');
var PassThrough = require('./_pass-through');
var ReadableStream = require('./readable');

/**
 */

function WritableStream(options) {
  this._passThrough = new PassThrough();
  this._reader = new ReadableStream(this._passThrough);
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

  end: function(chunk) {
    if (chunk != void 0) {
      this.write(chunk);
    }
    this._passThrough.end();
  },

  /**
   */

  getReader: function() {
    return this._reader;
  }
});

/**
 */

WritableStream.create = require('../internal/create-object');

/**
 */

module.exports = WritableStream;
