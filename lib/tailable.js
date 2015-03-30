var through      = require("through2");
var EventEmitter = require("fast-event-emitter");

module.exports = function(db, reject) {
  if (!reject) reject = ["load"];
  var tails = [];

  return function() {
    return through.obj(function(operation, enc, next) {
      if (operation.name === "tail") {
        tails.push(this);
      } else {
        var self = this;
        var stream = db().on("data", function(data) {
          self.push(data);
        }).on("end", function() {
          next();
          if (~reject.indexOf(operation.name)) return;
          for (var i = tails.length; i--;) tails[i].push(operation);
        }).end(operation);
      }
    }); 
  }
}