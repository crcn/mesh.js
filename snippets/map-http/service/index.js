
// override m
var realtimeBus = require("mesh-socket.io");
var mesh        = require("mesh");

module.exports = function(options, bus) {

  if (!bus) bus = mesh.noop;

  bus = mesh.parallel(
    mesh.reject("tail", realtimeBus(options))
  );
}
