
module.exports = function(db, reject) {
  if (!reject) reject = ["load"];
  var tails = [];

  return function(operation) {
    var stream;
    if (operation.name === "tail") {
      stream = db(operation);
      tails.push(stream);
    } else {
      var self = this;
      stream = db(operation);
      stream.on("data", function() { });
      stream.on("end", function() {
        if (~reject.indexOf(operation.name)) return;
        for (var i = tails.length; i--;) tails[i].emit("data", operation);
      });
    }
    return stream;
  };
};
