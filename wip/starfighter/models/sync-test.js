var sync   = require("./sync");
var expect = require("expect.js");
var group  = require("./group");
var ship   = require("./ship");
var space  = require("./space");
var mesh   = require("mesh");

describe(__filename + "#", function() {

  var fakeBus;
  var ops;

  beforeEach(function() {
    ops = [];
    fakeBus = mesh.tailable(mesh.wrap(function(operation, next) {
      ops.push(operation);
      next();
    }), function(a, b) {
      return /insert|update|remove/.test(b.name);
    });
  })

  it("can be created", function() {
    sync({ bus: mesh.noop });
  });

  it("properly syncs inserts", function(next) {
    var s = sync({ bus: fakeBus, entities: group() });
    s.entities.add(ship());

    s.update();

    setTimeout(function() {
      expect(ops.length).to.be(2);
      expect(ops[1].name).to.be("insert");
      next();
    }, 10);
  });

  it("properly syncs updates", function(next) {
    var s = sync({ bus: fakeBus, entities: group() });
    var sh = ship();
    s.entities.add(sh);
    s.update();
    sh.velocity = 100;
    s.update();

    setTimeout(function() {
      expect(ops.length).to.be(3);
      expect(ops[2].name).to.be("update");
      next();
    }, 10);
  });

  it("syncs removes", function(next) {
    var s = sync({ bus: fakeBus, entities: group() });
    var sh = ship();
    s.entities.add(sh);
    s.update();

    sh.dispose();
    s.update();

    setTimeout(function() {
      expect(ops.length).to.be(3);
      expect(ops[2].name).to.be("remove");
      next();
    }, 10);
  });

  it("syncs tailed inserts", function(next) {
    var s = sync({ bus: fakeBus, entities: group(), createItem: function(data) {
      return ship(data);
    } });
    fakeBus(mesh.op("insert", { data: ship({x:100}).toJSON() }));
    setTimeout(function() {
      s.update();
      expect(s.entities.items.length).to.be(1);
      expect(s.entities.items[0].x).to.be(100);
      next();
    }, 50);
  });

  it("syncs tailed removes", function(next) {

    var g = group();
    var sh = ship();
    g.add(sh);

    var s = sync({ bus: fakeBus, entities: g, createItem: function() { } });
    fakeBus(mesh.op("remove", { query: { cid: sh.cid } }));
    setTimeout(function() {
      s.update();
      expect(s.entities.items.length).to.be(0);
      next();
    }, 50);
  });

  it("syncs tailed updates", function(next) {

    var g = group();
    var sh = ship({ remote: true });
    g.add(sh);

    var s = sync({ bus: fakeBus, entities: g });
    fakeBus(mesh.op("update", { query: { cid: sh.cid }, data: { x: 100 } }));
    setTimeout(function() {
      s.update();
      expect(sh.x).to.be(100);
      next();
    }, 50);
  });

  it("doens't emit an update op if the item updated is removed", function(next) {
    var g = group();
    var sh = ship();
    g.add(sh);
    var s = sync({ bus: fakeBus, entities: g });
    fakeBus(mesh.op("remove", { query: { cid: sh.cid } }));
    sh.x = 100;

    setTimeout(function() {
      s.update();
      setTimeout(function() {
        expect(ops.length).to.be(2);
        expect(ops[1].name).to.be("remove");
        next();
      }, 10);
    }, 10);
  });

  it("doesn't repush changes applied to a local item", function(next) {
    var g = group();
    var sh = ship();
    g.add(sh);
    var s = sync({ bus: fakeBus, entities: g });
    fakeBus(mesh.op("update", { query: { cid: sh.cid }, data: { x: 200 } }));


    setTimeout(function() {
      s.update();
      setTimeout(function() {
        s.update();
        setTimeout(function() {
          expect(ops.length).to.be(2);
          next();
        }, 10);
      }, 10);
    }, 10);
  });

  xit("removes remote emit operations if a local update exists", function(next) {
    var g = group();
    var sh = ship();
    g.add(sh);
    var s = sync({ bus: fakeBus, entities: g });
    fakeBus(mesh.op("update", { query: { cid: sh.cid }, data: { x: 200 } }));
    sh.x = 100;

    setTimeout(function() {
      s.update();
      expect(sh.x).to.be(100);
      next();
    }, 10);
  });

  it("doesn't insert items that have already been added", function(next) {
    var g = group();
    var sh = ship();
    g.add(sh);
    var s = sync({ bus: fakeBus, entities: g, createItem: ship });
    fakeBus(mesh.op("insert", { data: sh.toJSON() }));

    setTimeout(function() {
      s.update();
      expect(g.items.length).to.be(1);
      next();
    }, 10);
  });

  it("doesn't update a prop if the TS is older", function(next) {
    var g = group();
    var ts = Date.now();
    var sh = ship({ ts: Number(ts) + 100 });
    sh.ts = ts + 100;
    g.add(sh);
    var s = sync({ bus: fakeBus, entities: g });
    fakeBus(mesh.op("update", { query: { cid: sh.cid }, data: { ts: ts, x: 200 } }));


    setTimeout(function() {
      s.update();
      expect(sh.x).to.be(0);
      next();
    }, 10);
  });

  it("loads stuff from the bus upon initialization", function(next) {

    var bus = mesh.wrap(function(op, next) {
      next(void 0, [{cid:1},{cid:2}]);
    });

    var g = group();
    var s = sync({ bus: bus, entities: g, createItem: function(data) {
      return ship(data);
    } });

    setTimeout(function() {
      s.update();
      expect(g.items.length).to.be(2);
      next();
    }, 10);
  });

  it("does not synchronize updates for ship bullets", function(next) {
    var sh = ship();
    var g = group();
    var sp = space(g);
    g.add(sh);
    var s = sync({ bus: fakeBus, entities: g });

    sh.fire();
    s.update();
    sp.update();

    setTimeout(function() {
      s.update();
      setTimeout(function() {
        s.update();
        expect(ops.length).to.be(2);
        next();
      }, 10);
    }, 10);
  });
});
