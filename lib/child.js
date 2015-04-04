var createOperation = require("./operation");
var extend          = require("xtend/mutable");

module.exports = function(db, options) {
  return function(operation) {
    return db(extend({}, operation, options));
  };
};
