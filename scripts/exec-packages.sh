#!/usr/bin/env node
var eachAsync = require('./utils/each-async');
var exec      = require('./utils/exec');
var path      = require('path');
var log       = require('./utils/log');

require('events').EventEmitter.defaultMaxListeners = 0;

var packagePaths = require('./utils/package-paths');

eachAsync(packagePaths, execArgv)
.then(log.done, function(error) {
  log.error();
  process.exit(1);
});

function execArgv(packagePath) {
  var args = process.argv.slice(2);
  log.packageCommand(args.join(' ') + ' %s', packagePath);
  return exec(args.shift(), args, {
    cwd: path.dirname(packagePath)
  })
}