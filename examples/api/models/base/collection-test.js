var Collection = require("./collection");
var mesh       = require("../../../..");
var expect     = require("expect.js");
var extend     = require("xtend/mutable");

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
    new Collection();
  });

  it("can load data into the collection", function(next) {
    var c = new Collection({
      bus: mesh.attach({ yields: [
        void 0,
        [{name:"a"}, {name:"b"}, {name:"c"}]
      ]}, fakeBus)
    });

    c.load(function() {
      expect(c.length).to.be(3);
      expect(c.at(0).name).to.be("a");
      next();
    });
  });

  it("properly diffs the collection when data changes", function() {
    var c = new Collection({
      data: [{id:1, name:"a"}, {id:2,name:"b"}]
    });

    var m = c.at(0);
    expect(m.name).to.be("a");

    c._onData([{id:1,name:"c"}]);
    expect(c.length).to.be(1);
    expect(c.at(0)).to.be(m);
    expect(m.name).to.be("c");
  });
});
