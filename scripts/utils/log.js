var path = require('path');

exports.info = function(message) {
  console.log.apply(console, ['\x1b[1m' + message + '\x1b[22m'].concat(
    Array.prototype.slice.call(arguments, 1)
  ));
}

exports.done = function() {
  exports.info('Done.');
}

exports.error = function() {
  exports.info('Error! See above.');
}

exports.packageCommand = function(message, packageCommand) {
  exports.info.apply(exports, [message, path.basename(path.dirname(packageCommand))].concat(
    Array.prototype.slice.call(arguments, 2)
  ));
}