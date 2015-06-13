var expect   = require("expect.js");
var viewport = require("./viewport");
var space    = require("./space");
var ship     = require("./ship");
var sinon    = require("sinon");

describe(__filename + "#", function() {

  it("can add a viewport", function() {
    viewport();
  });

  it("can focus on a target and keep it within sight of the viewport", function() {
    var sp = space();

    var vp = viewport({
      width: 500,
      height: 500,
      space: sp
    });

    var sh = ship();
    sp.entities.add(sh);

    vp.focus = sh;

    sh.x = 1000;

    vp.update();

    expect(sp.x).to.be(-600);
    expect(sp.y).to.be(100);

    sh.y = 1000;
    vp.update();
    expect(sp.y).to.be(-600);

    sh.x = -1000;
    sh.y = -1000;
    vp.update();
    expect(sp.x).to.be(1100);
    expect(sp.y).to.be(1100);
  });

  it("can set the padding in the viewport", function() {
    var sp = space();

    var vp = viewport({
      width: 100,
      height: 100,
      space: sp
    });

    var sh = ship({
      x: 0,
      y: 0
    });

    sp.entities.add(ship);

    vp.focus = sh;
    vp.update();
    expect(sp.x).to.be(100);
    expect(sp.y).to.be(100);
    vp.padding = 10;
    vp.update();
    expect(sp.x).to.be(90);
    expect(sp.y).to.be(90);
  });

  it("returns TRUE if an entity is in view", function() {
    var sp = space();

    var vp = viewport({
      width: 100,
      height: 100,
      space: sp
    });

    var sh = ship({
    });

    sp.entities.add(ship);

    sp.x = 1000;
    sp.y = 1000;

    expect(vp.canSee(sh)).to.be(false);
    sp.x = 50;
    sp.y = 50;
    expect(vp.canSee(sh)).to.be(true);
    sp.x = 1000;
    sp.y = 50;
    expect(vp.canSee(sh)).to.be(false);
    sp.x = 50;
    sp.y = 1000;
    expect(vp.canSee(sh)).to.be(false);
  });
});
