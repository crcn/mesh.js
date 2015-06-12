var io = require("mesh-socket.io");

module.exports = function(options, bus) {
  return mesh.parallel(bus, io({ channel: options.channel || "operations" }, bus));
};
