var through         = require("through2");
var createOperation = require("./operation");
var extend          = require("deep-extend");

module.exports = function(db, options) {
  return function() {
    return through.obj(function(op, enc, next) {
      var childOperation = createOperation(op.name, extend({}, op, options));
      var self = this;
      db().on("data", function(data) {
        self.push(data);
      }).once("end", next).end(childOperation);
    });
  };
};
