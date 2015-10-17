var extend = require('../internal/extend');
var PassThrough = require('./_pass-through');
var ReadableStream = require('./readable');

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

WritableStream.create = require('../internal/create-object');
WritableStream.extend = require('../internal/extend');

/**
 */

module.exports = WritableStream;
