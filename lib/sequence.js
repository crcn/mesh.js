var through = require("through2");
var Readable = require("stream").Stream;

/**
 */

module.exports = function() {
  var dbs = Array.prototype.slice.apply(arguments);
  return function(name, properties) {
    var i = 0;

    var stream = new Readable();

    process.nextTick(function() {
      function run() {
        if (i >= dbs.length) return stream.emit("end");
        var db = dbs[i++];
        db(name, properties).on("data", function(data) {
          stream.emit("data", data);
        }).on("end", run);
      }
      run();
    });

    return stream;
  };
};
