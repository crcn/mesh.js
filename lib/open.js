var through = require("obj-stream").through;

module.exports = function(bus) {
  return through(function(operation, next) {
    var self = this;
    bus(operation).on("data", function(data) {
      self.push(data);
    }).on("end", next);
  });
};
