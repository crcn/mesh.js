var space    = require("./space");
var collider = require("./collider");
var ship     = require("./ship");
var group    = require("./group");
var expect   = require("expect.js");

describe(__filename + "#", function() {

  it("can be created", function() {
    collider();
  });

  it("collides two items if they overlap", function() {
    var e = group();
    var g = collider(space(e));

    var s1 = ship({ x: 100, y: -100 });
    var s2 = ship({ x: 100, y: 100, velocity: 10 });

    e.add(s1);
    e.add(s2);

    expect(e.items.length).to.be(2);

    for (var i = 17; i--;) {
      expect(e.items.length).to.be(2);
      g.update();
    }

    expect(e.items.length).to.be(0);
  });
});
