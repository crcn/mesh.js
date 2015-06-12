var sift = require("sift");
var mesh = require("mesh");

/**
 * fakes all persistence & uses the given fixtures if testMode is present
 */

module.exports = function(options, bus) {
  
  if (!bus) bus = mesh.noop;
  var fakeBus = _fake(options);

  return function(operation) {
    if (operation.fake) return fakeBus(operation);
    return bus(operation);
  }
}

/**
 */

function _fake(options) {
  return mesh.stream(function(operation, stream) {
    if (operation.name === "load")
    sift(operation.query, options.fixtures[operation.collection]).forEach(function(result) {
      stream.write(result);
    });

    stream.end();
  });
}
