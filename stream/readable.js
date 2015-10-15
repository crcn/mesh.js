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
          writable.end();
        } else {
          writable.write(item.value);
          pump();
        }
      }, writable.abort.bind(writable));
    };
    pump();
  }
});

/**
 */

module.exports = ReadableStream;
