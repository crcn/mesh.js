var mesh   = require("mesh");
var mio    = require("mesh-socket.io");
var weak   = require("./weak");
var compress = require("./compress");

module.exports = function(server, bus, room) {

  if (!bus) bus = mesh.noop;

  server.on("connection", function(c) {
    var pbus = weak(bus);
    var cbus = mio({ client: c }, mesh.attach({ req: void 0, resp: void 0 }, pbus));
    var tail = bus(mesh.op("tail"));
    tail.pipe(mesh.open(mesh.attach({ resp: false }, cbus)));
    c.once("disconnect", tail.end.bind(tail));
  });

  return bus;
}
