var broker   = require("./broker");
var memory   = require("mesh-memory");
var tailable = require("./tailable");

module.exports = function(app) {

  var bus = memory();
  bus     = tailable(bus);
  bus     = broker(app.sio, bus);

  return bus;
};
