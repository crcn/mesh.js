var Base  = require("./base");
var expect = require("expect.js");

describe(__filename + "#", function() {
  it("sets props on the base model", function() {
    var m = new Base({ name: "a" });
    expect(m.name).to.be("a");
  });
  it("can be extended", function() {
    var Child = Base.extend(function() { });
    expect(new Child() instanceof Base).to.be(true);
  });
  it("can extend a child class", function() {
    var Child = Base.extend(function() { }).extend(function() { });
    expect(new Child() instanceof Base).to.be(true);
  })
});
