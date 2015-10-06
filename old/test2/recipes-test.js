var mesh = require("../");
var expect  = require("expect.js");
var through = require("through2");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can map data to another value", function(next) {

    function bus(name, props) {
      return _([{ name: "a" }, { name: "b" }]);
    }

    bus().
    pipe(_.pipeline(
      _.map(function(d) { return d.name; }),
      _.collect
    )).
    on("data", function(items) {
      expect(items[0]).to.be("a");
      expect(items[1]).to.be("b");
      next();
    });
  });
});
