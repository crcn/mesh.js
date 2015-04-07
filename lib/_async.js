var Writable = require("obj-stream").Writable;

/**
 */

module.exports = function(fn) {
  var stream = new Writable();

  process.nextTick(function() {
    fn(stream);
  });

  return stream.reader;
};
