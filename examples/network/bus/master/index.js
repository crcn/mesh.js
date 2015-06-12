var mesh      = require("mesh");
var commands  = require("extra/commands");
var fs        = require("fs");
var path      = require("path");
var balance   = require("mesh-balance");
var net       = require("net");
var ros       = require("ros");
var socketBus = require("../common/socket-bus");

/**
 */

module.exports = function(config) {

  if (!config) {
    config = {};
  }

  if (!config.workers) config.workers = [];

  if (!config.log) {
    config.log = console.log.bind(console);
  }

  // capture all operations and distrubite them
  var bus = _distribute(config, bus);

  // commands
  bus     = _commands(config, bus);

  // setup the server - take any commands and execute
  _server(config, bus);

  return bus;
}

/**
 * commands for the
 */

function _commands(config, bus) {

  var cs = {};

  // scan the commands directory
  fs.readdirSync(path.join(__dirname, "commands")).filter(function(filename) {

    // skip hidden files
    return !/^\./.test(filename);
  }).forEach(function(filename) {

    // include it
    cs[path.basename(filename).split(".").shift()] = require(path.join(__dirname, "commands", filename))(config, bus);
  });

  return commands(cs, bus);
}

/**
 */

function _distribute(config, bus) {

  var dists = {
    parallel : mesh.parallel(config.workers),
    sequence : mesh.sequence(config.workers),
    rotate   : mesh.retry(config.retryCount, balance.rotate(config.workers)),
    random   : mesh.retry(config.retryCount, balance.random(config.workers)),
    least    : mesh.retry(config.retryCount, balance.least(config.workers))
  };

  return function(operation) {
    var distBus = dists[operation.dist] || dists.sequence;
    return distBus(operation);
  }
}

/**
 */

function _server(config, bus) {

  var server = net.createServer(function(connection) {

    var workerBus = socketBus(connection, bus);
    config.workers.push(workerBus);

    connection.once("close", function() {
      config.workers.splice(config.workers.indexOf(workerBus), 1);
    });
  });

  config.log("master server listener on port %d", config.port);

  server.listen(config.port);

  return bus;
}
