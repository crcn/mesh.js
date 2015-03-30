var through = require("through2");

module.exports = function(db) {
  return through.obj(function(operation, enc, next) {
    var self = this;
    db(operation.name, operation).on("data", function(data) {
      self.push(data);
    }).on("end", next);
  });
};
