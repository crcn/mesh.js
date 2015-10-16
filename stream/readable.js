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
    var pump = () => {
      this.read().then((item) => {
        if (item.done) {
          if (!options.preventClose) writable.end();
        } else {
          writable.write(item.value);
          pump();
        }
      }, options.preventAbort ? void 0 : writable.abort.bind(writable));
    };
    pump();
    return writable;
  }
});

/**
 */
 
ReadableStream.create = require('../internal/create-object');

/**
 */

module.exports = ReadableStream;
