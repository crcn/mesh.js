var stream = require("./stream");

module.exports = stream(function(operation, stream) {
  stream.end();
});
