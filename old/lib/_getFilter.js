
module.exports = function(match) {

  if (match instanceof RegExp) {
    return function(operation) {
      return match.test(operation.name);
    };
  } else if (match.test) {
    return function(operation) {
      return match.test(operation);
    };
  } else if (typeof match === "function") {
    return match;
  } else {
    return function(operation) {
      return operation.name === match;
    };
  }

  return function() {
    return false;
  };
};
