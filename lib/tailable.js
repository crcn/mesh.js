
module.exports = function(bus, reject) {
  if (!reject) reject = ["load"];
  var tails = [];

  return function(operation) {
    var stream;
    if (operation.name === "tail") {
      stream = bus(operation);
      tails.push(stream);
    } else {
      var self = this;
      stream = bus(operation);
      stream.on("data", function() { });
      stream.on("end", function() {
        if (~reject.indexOf(operation.name)) return;
        for (var i = tails.length; i--;) tails[i].emit("data", operation);
      });
    }
    return stream;
  };
};
