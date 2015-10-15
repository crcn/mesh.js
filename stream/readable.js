var extend = require('../internal/extend');

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

  read: function() {
    return this._passThrough.read();
  },

  /**
   */

  pipeTo: function(writable, options) {
    if (!options) options = {};
  }
});

/**
 */

module.exports = ReadableStream;
