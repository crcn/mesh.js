var mesh   = require("..");
var expect = require("expect.js");

describe(__filename + "#", function() {

  it("can set default properties on the operation", function(next) {
    var bus = mesh.defaults({name:"op"}, mesh.wrap(function(operation) {
      expect(operation.name).to.be("op");
      next();
    }));
    bus({});
  });

  it("does not override existing properties", function(next) {
    var bus = mesh.defaults({name:"op2", key:"value"}, mesh.wrap(function(operation) {
      expect(operation.name).to.be("op");
      expect(operation.key).to.be("value");
      next();
    }));
    bus({name:"op"});
  });

  it("can set defaults multiple times", function(next) {
    var bus = mesh.defaults({name:"op2", age:12, key:"val"}, mesh.wrap(function(operation) {
      expect(operation.name).to.be("op");
      expect(operation.key).to.be("value");
      expect(operation.age).to.be(12);
      next();
    }));

    bus = mesh.defaults({key:"value"}, bus);
    bus({name:"op"});
  });
});
