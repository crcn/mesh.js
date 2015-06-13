var _nonew = require("./_nonew");
var Base   = require("./base");
var expect = require("expect.js");

describe(__filename + "#", function() {
  it("can create a new class without the new keyword", function() {
    var clazz = _nonew(Base);
    expect(clazz() instanceof Base).to.be(true);
  });
  it("can create a new class with the new keyword", function() {
    var clazz = _nonew(Base);
    expect(new clazz() instanceof Base).to.be(true);
  });
});
