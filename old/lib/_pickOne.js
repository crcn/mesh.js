var Writable    = require("obj-stream").Writable;
var _async      = require("./_async");
var _eachSeries = require("./_eachSeries");
var _group      = require("./_group");
var through     = require("obj-stream").through;

/**
 */

module.exports = function(iterator) {
  return _group(function(operation, busses) {
    return _async(function(stream) {

      var found;
      var i = 0;

      iterator(busses, function(bus, next) {
        var index = ++i;
        var bs;

        // TODO - duplex this

        (bs = bus(operation)).pipe(through(function(data, next) {
          if (!found || found === index) {
            found = index;
            this.push(data);
          }
          next();
        })).once("end", function() {
          if (found) {
            stream.end();
          } else {
            next();
          }
        }).pipe(stream, { end: false });

        if (bs.writable) {
          stream.once("end", bs.end.bind(bs));
        }
      }, function() {
        stream.end();
      });
    });
  });
};
