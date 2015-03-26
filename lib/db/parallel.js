var Base   = require("./base");

/**
 */

function Parallel(databases) {
  this.databases = databases;
}

/**
 */

Base.extend(Parallel, {

  /**
   */

  run: function(operation, options, onRun) {
    var i = 0;
    var self = this;
    var combinedResult = {};

    this.databases.forEach(function (database) {
      database.run(operation, options, function(err, result) {
        if (err) i = this.databases.length;
        if (result) extend(combinedResult, result);
        if (++i > this.databases.length) return onRun(err, combinedResult);
      });
    });
  }
});

Parallel.create = function() {
  return new Parallel(Array.prototype.apply(arguments));
};

module.exports = Parallel;