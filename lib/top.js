var operation = require("./operation");

module.exports = function(bus) {
  return function(operationName, options) {

    if (typeof operationName === "object") {
      return bus(operationName);
    }

    return bus(operation(operationName, options));
  };
};
