var through      = require("through2");
var EventEmitter = require("fast-event-emitter");
var Stream       = require("stream").Stream;
var operation    = require("./operation");

module.exports = function(db, reject) {
  if (!reject) reject = ["load"];
  var tails = [];

  return function(name, properties) {
    if (name === "tail") {
      var stream = new Stream();
      tails.push(stream);
      return stream;
    } else {
      var self = this;
      var stream = db(name, properties);
      stream.on("data", function(){});
      stream.on("end", function() {
        if (~reject.indexOf(name)) return;
        for (var i = tails.length; i--;) tails[i].emit("data", operation(name, properties));
      });
      return stream;
    }
  }
}