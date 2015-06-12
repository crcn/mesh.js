var expect = require("expect.js");
var mesh   = require("../..");
var memory = require("mesh-memory");
var join   = require("./index");

describe(__filename + "#", function() {

  var bus;

  beforeEach(function(next) {
    var bus = memory();
    bus     = join(bus);
    bus     = mesh.limit(1, bus);

    bus = mesh.attach({ collection: "people" }, bus);
    bus({ name: "insert",  data: { id: 1, name: "jeff", friends: [2, 3]}});
    bus({ name: "insert", data: { id: 2, name: "abe", friends: [1, 3]}});
    bus({ name: "insert", data: { id: 3, name: "sarah", friends: [1, 1]}}).on("end", next);
  });


  it("can join any abritrary streem", function(next) {

    var bus = mesh.wrap(function(operation, next) {
      var count = operation.count || 1;
      var ret = [];
      for (var i = count; i--;) ret.push({ name: operation.name, i: i });
      next(void 0, ret);
    });

    bus = join(bus);

    bus({
      name: "run",
      join: {
        op1: function(data) {
          return bus({ name: "op1", multi: true, count: 2 });
        }
      }
    }).on("data", function(data) {
      expect(data.name).to.be("run");
      expect(data.op1.length).to.be(2);
      expect(data.op1[0].name).to.be("op1");
      next();
    });
  });
});
