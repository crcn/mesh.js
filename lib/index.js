var root      = require("./root");
var parallel  = require("./parallel");
var sequence  = require("./sequence");
var operation = require("./operation");
var delta     = require("./delta");

/**
 */

module.exports = function(database) {

  if (arguments.length > 1) {
    database = m.parallel.apply(void 0, Array.prototype.apply(arguments));
  }

  return root(database);
}

/**
 */

module.exports.delta     = delta;
module.exports.sequence  = sequence;
module.exports.parallel  = parallel;
module.exports.operation = operation;
