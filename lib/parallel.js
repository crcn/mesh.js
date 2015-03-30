var through = require("through2");

/**
 */

module.exports = function() {
  var dbs = Array.prototype.slice.apply(arguments);
  return function() {
    return through.obj(function(operation, enc, next) {
      var i = 0;
      var self = this;
      dbs.forEach(function(db) {
        db().on("data", function(data) {
          self.push(data);
        }).on("end", function() {
          if (++i >= dbs.length) {
            return next();
          }
        }).end(operation);
      });
    });
  };
};
