var Base   = require("./base");

/**
 */

function Sequence(databases) {
  this.databases = databases;
}

/**
 */

Base.extend(Sequence, {

  /**
   */

  run: function(operation, options, onRun) {
    var i = 0;
    var self = this;
    var combinedResult = {};

    function next(err, result) {

      if (err) i = this.databases.length;
      if (result) extend(combinedResult, result);
      if (i >= this.databases.length) return onRun(err, combinedResult);

      this.databases[i++].run(operation, options, onRun);
    }

    next();
  }
});

Sequence.create = function() {
  return new Sequence(Array.prototype.apply(arguments));
};

module.exports = Sequence;