var through         = require("through2");
var createOperation = require("./operation");
var extend          = require("deep-extend");

module.exports = function(db, options) {
  return function(name, properties) {
    return db(name, extend({}, properties, options));
  };
};
