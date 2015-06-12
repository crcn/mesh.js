var async = require("async");
var _     = require("highland");

module.exports = function(operations, bus, complete) {
  var opsAsArray = [];
  var results    = {};
  Object.keys(operations).forEach(function(key) {
    opsAsArray.push({ key: key, op: operations[key] });
  });

  async.each(opsAsArray, function(info, next) {
    bus(info.op)
    .pipe(_.pipeline(_.collect))
    .on("data", function(result) {
      if (!info.op.multi) result = result[0];
      results[info.key] = result;
    })
    .once("end", next);
  }, function() {
    complete(void 0, results);
  });

}
