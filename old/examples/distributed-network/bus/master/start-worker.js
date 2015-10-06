var childProcess  = require("child_process");
var spawn         = childProcess.spawn;
var extend        = require("xtend/mutable");
var EventEmitter  = require("events").EventEmitter;
var commands      = require("snippets/commands");
var mesh          = require("../../../..");
var ros           = require("ros");

var _idCount = 0;

/**
 */

module.exports = function(config) {
  return function(operation, next) {

    var count = Number(operation.count || 1);
    config.log("spawning %d workers...", count);

    for (var i = count; i--;) {
      spawn("/usr/local/bin/node", [config.workerPath], {
        stdio: "inherit",
        cwd: process.cwd,
        env: {
          MASTER_PORT : config.port,
          ID          : (++_idCount)
        }
      });
    }

    next();
  };
};
