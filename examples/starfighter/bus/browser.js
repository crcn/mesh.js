var mio      = require("mesh-socket.io");
var mesh     = require("mesh");
var tailable = require("./tailable");
var compress = require("./compress");

module.exports = function(app) {
  if (!process.browser) return mesh.noop;
  var bus = mesh.noop;
  bus = tailable(bus);
  bus = mesh.reject("tail", mesh.limit(1, mio({
    pack   : compress.pack,
    unpack : compress.unpack
  }, bus)), bus);
  return bus;
};
