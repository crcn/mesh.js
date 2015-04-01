var createOperation = require("./operation");
var extend          = require("xtend/mutable");

module.exports = function(db, options) {
  return function(name, properties) {
    return db(name, extend({}, properties, options));
  };
};
