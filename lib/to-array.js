var through = require("through2");

module.exports = function() {
  var buffer = [];
  return through.obj(function(chunk, enc, next) {
    buffer.push(chunk);
    next();
  }, function() {
    this.push(buffer);
  });
}