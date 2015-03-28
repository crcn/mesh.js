var through = require("through2");

/**
 */

module.exports = function() {
  var dbs = Array.prototype.slice.apply(arguments);
  return function() {
    return through.obj(function(operation, enc, next) {
      var i = 0;
      var self = this;

      function run () {
        if (i >= dbs.length) return next();
        var db = dbs[i++];
        db().on("data", function (data) {
          self.push(data);
        }).on("end", run).end(operation);
      }
      run();
    });
  };
};
