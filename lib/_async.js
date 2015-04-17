var Stream = require("obj-stream").Stream;

/**
 */

module.exports = function(fn) {
  var stream = new Stream();

  process.nextTick(function() {
    fn(stream);
  });

  stream.reader = stream;

  return stream;
};
