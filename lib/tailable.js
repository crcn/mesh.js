var Stream       = require("obj-stream").Stream;
var operation    = require("./operation");

module.exports = function(db, reject) {
  if (!reject) reject = ["load"];
  var tails = [];

  return function(name, properties) {
    var stream;
    if (name === "tail") {
      stream = new Stream();
      tails.push(stream);
    } else {
      var self = this;
      stream = db(name, properties);
      stream.on("data", function() { });
      stream.on("end", function() {
        if (~reject.indexOf(name)) return;
        for (var i = tails.length; i--;) tails[i].emit("data", operation(name, properties));
      });
    }
    return stream;
  };
};
