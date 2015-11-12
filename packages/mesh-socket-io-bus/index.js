var io     = require("socket.io-client");
var ros    = require("ros");
var mesh   = require("mesh");

/**
 */

module.exports = function(options, bus) {

  if (!bus) bus = mesh.noop;

  if (!options) options = {};
  if (typeof options === "string") {
    options = { channel: options };
  }

  if (!options.host && process.browser) {
    options.host = location.protocol + "//" + location.host;
  }

  var client  = options.client  || options.connection || io(options.host);
  var channel = options.channel || "o";
  var pack    = options.pack    || function(msg) { return msg; };
  var unpack  = options.unpack  || function(msg) { return msg; };

  client.on("disconnect", function() {
    bus(mesh.op("disconnect"));
  });

  return ros(
  function(listener) {
    client.on(channel, function(msg) {
      listener(unpack(msg));
    });
  },
  function(msg) {
    client.emit(channel, pack(msg));
  }, bus);
};
