var ship   = require("./ship");
var space  = require("./space");
var expect = require("expect.js");
var Bullet = require("./bullet");

describe(__filename + "#", function() {

  it("can be created", function() {
    ship();
  })

  it("can fire a bullet", function() {
    var s = ship({ x: 100, y: 100, rotation: 90 });
    var sp = space();
    sp.entities.add(s);

    s.fire();
    expect(sp.entities.items.length).to.be(2);
    var bullet = sp.entities.items[1];
    for (var i = 5; i--;) {
      sp.update();
    }

    expect(bullet.x).to.be(180);
    expect(bullet.y).to.be(115);
  });


});
