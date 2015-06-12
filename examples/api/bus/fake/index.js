var sift = require("sift");

/**
 * fakes all persistence & uses the given fixtures if testMode is present
 */

module.exports = function(options, bus) {
  var fakeBus = _fake(options);

  return function(operation) {
    if (operation.fake) return fakeBus(operation);
    return bus(operation);
  }

  return bus;
}

/**
 */

function _fake(options) {
  return function(operation) {
    console.log("TODO");
  }
}
