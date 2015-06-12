var child_process = require("child_process");
var spawn         = child_process.spawn;
var extend        = require("xtend/mutable");
var EventEmitter  = require("events").EventEmitter;
var commands      = require("snippets/commands");
var mesh          = require("mesh");
var ros           = require("ros");

var _idCount = 0;

/**
 */

module.exports = function(config) {
  return function(operation, next) {
    config.log("TODO"); // find index of worker

    next();
  }
}
