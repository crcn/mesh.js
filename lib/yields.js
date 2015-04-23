var wrap     = require("./wrap");
attach       = require("./attach");

module.exports = function(data) {

  var fn = typeof data === "function" ? data : function() {
    return data;
  };

  return attach({ multi: true }, wrap(function(operation, next) {
    next(void 0, fn(operation));
  }));
}
