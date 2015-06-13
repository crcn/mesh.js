var expect = require("expect.js");
var bullet = require("./bullet");
var sinon  = require("sinon");

describe(__filename + "#", function() {

  it("explodes the bullet after ttl", function(next) {
    var b = bullet({ ttl: 5 });
    setTimeout(function() {
      var s = sinon.stub(b, "dispose");
      b.update();
      expect(s.callCount).to.be(1);
      next();
    }, 10);
  });
});
