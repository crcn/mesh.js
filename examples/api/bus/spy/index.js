var mesh   = require("../../../..");
var stream = require("obj-stream");
var sift   = require("sift");

module.exports = function(bus, tester) {

  if (!tester) tester = function(spy, op) {
    return true;
  };

  var spies = [];

  return function(operation) {

    var s;

    if (operation.name === "spy") {
      s = operation.stream = new stream.Stream();
      spies.push(operation);
      s.once("end", function() {
        spies.splice(spies.indexOf(operation), 1);
      });
    } else {

      s = operation.stream = bus(operation);

      spies.forEach(function(spy) {
        if (tester(spy, operation)) {
          spy.stream.write(operation);
        }
      });
    }

    return s;
  };
};
