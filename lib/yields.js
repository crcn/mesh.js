var wrap     = require("./wrap");
attach       = require("./attach");

module.exports = function(error, data) {

  var errorFn = typeof error === "function" ? error : function() {
    return error;
  };

  var dataFn = typeof data === "function" ? data : function() {
    return data;
  };

  return attach({ multi: true }, wrap(function(operation, next) {
    next(errorFn(operation), dataFn(operation));
  }));
};
