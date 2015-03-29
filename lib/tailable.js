var through      = require("through2");
var EventEmitter = require("fast-event-emitter");

module.exports = function(db) {
  var tails = [];

  return function() {
    return through.obj(function(operation, enc, next) {
      if (operation.name === "tail") {
        tails.push(this);
      } else {
        var self = this;
        var stream = db().pipe(this).write(operation);
        for (var i = tails.length; i--;) tails[i].push(operation);
      }
    }); 
  }
}