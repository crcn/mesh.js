var ros      = require("ros");
var commands = require("extra/commands");
var net      = require("net");
var mesh     = require("mesh");
var socketBus = require("../common/socket-bus");

/**
 */

module.exports = function(config) {

  var bus = mesh.noop;
  bus     = commands(config.commands, bus);
  bus     = _client(config, bus);

  return bus;
}

/**
 */

function _client(config, bus) {

  var client = new net.Socket();
  client.connect(config.masterPort, "127.0.0.1", function() {
  });

  return socketBus(client, bus);
}
