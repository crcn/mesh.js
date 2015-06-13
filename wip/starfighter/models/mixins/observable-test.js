var observable = require("./observable");
var expect     = require("expect.js");
var extend     = require("xtend/mutable");

describe(__filename + "#", function() {

  it("can define a listener", function() {
    var obs = extend({}, observable);
    obs.on("event", function() { });
  });

  it("can emit one event", function() {
    var obs = extend({}, observable);
    var i = 0;
    obs.on("event", function(v, v2) {
      expect(v).to.be(1);
      expect(v2).to.be(2);
      i++;
    });
    obs.emit("event", 1, 2);
    expect(i).to.be(1);
  });

  it("can emit one event to multiple listeners", function() {
    var obs = extend({}, observable);
    var i = 0;
    obs.on("event", function(v, v2) {
      i++;
    });

    obs.on("event", function(v, v2) {
      i++;
    });

    obs.emit("event", 1, 2);
    expect(i).to.be(2);
  });

  it("can remove a listener", function() {
    var obs = extend({}, observable);
    var i = 0;
    obs.on("event", function(v, v2) {
      i++;
      obs.off("event", arguments.callee);
    });


    obs.emit("event", 1, 2);
    expect(i).to.be(1);

    obs.emit("event", 1, 2);
    expect(i).to.be(1);
  });

});
