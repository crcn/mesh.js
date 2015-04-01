var through = require("obj-stream").through;

module.exports = function(db) {
  return through(function(operation, next) {
    var self = this;
    db(operation.name, operation).on("data", function(data) {
      self.push(data);
    }).on("end", next);
  });
};
