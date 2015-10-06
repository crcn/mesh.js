var mesh = require("../");
var expect  = require("expect.js");

describe(__filename + "#", function() {
  it("can be created", function() {
    var op = mesh.operation("insert", { collection: "blarg" });
    expect(op.name).to.be("insert");
    expect(op.collection).to.be("blarg");
  });
});
