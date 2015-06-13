var BaseModel = require("./model");
var mesh      = require("../../../..");
var expect    = require("expect.js");

describe(__filename + "#", function() {

  var fakeBus;
  var ops;

  beforeEach(function() {
    ops = [];
    fakeBus = mesh.wrap(function(operation, next) {
      ops.push(operation);
      next.apply(this, operation.yields || []);
    });
  });

  it("can be created", function() {
    new BaseModel();
  });

  it("can load data into the model from a bus", function(next) {
    var m = new BaseModel({
      bus: mesh.attach({ yields: [void 0, { name: "a", last: "b" }]}, fakeBus)
    });

    m.load(function() {
      expect(m.name).to.be("a");
      expect(m.last).to.be("b");
      next();
    });
  });

  it("inserts the model if ID is not present", function(next) {
    var m = new BaseModel({
      bus: fakeBus,
      name: "a"
    });

    m.save(function() {
      expect(ops[0].name).to.be("insert");
      expect(ops[0].data.name).to.be("a");
      next();
    });
  });

  it("updates the model if ID is present", function(next) {
    var m = new BaseModel({
      bus: fakeBus,
      id: "m1",
      name: "a"
    });

    m.save(function() {
      expect(ops[0].name).to.be("update");
      expect(ops[0].data.name).to.be("a");
      expect(ops[0].data.id).to.be("m1");
      expect(ops[0].query.id).to.be("m1");
      next();
    });
  });

  it("can remove a model", function(next) {
    var m = new BaseModel({
      bus: fakeBus,
      id: "m1"
    });

    m.remove(function() {
      expect(ops[0].name).to.be("remove");
      expect(ops[0].query.id).to.be("m1");
      next();
    });
  });

  it("emits a change event when loading data", function(next) {
    var m = new BaseModel({
      bus: mesh.attach({ yields: [void 0, { name: "a", last: "b" }]}, fakeBus),
      id: "m1"
    });
    var i = 0;
    m.once("change", function() {
      i++;
    });
    m.load(function() {
      expect(i).not.to.be(0);
      next();
    });
  });
});
