var extend = require('../internal/extend');
var PassThrough = require('./_pass-through');
var ReadableStream = require('./readable');
var Chunk = require('./chunk');

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

  write: function(chunkValue) {
    return this._passThrough.write(new Chunk(chunkValue));
  },

  /**
   */

  abort: function(error) {
    this._passThrough.abort(error);
  },

  /**
   */

  end: function(chunkValue) {
    if (chunkValue != void 0) this.write(chunkValue);
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

module.exports = WritableStream;
