var createOperation = require("./operation");
var extend          = require("xtend/mutable");
var top             = require("./top");

module.exports = function(db, options) {
  return function(operation) {
    return db(extend({}, operation, options));
  };
};
