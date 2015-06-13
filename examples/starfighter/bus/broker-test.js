var broker = require("./broker");
var mesh   = require("mesh");
var memory = require("mesh-memory");
var expect = require("expect.js");
var EventEmitter = require("events").EventEmitter;

function _fakeClient() {

  var i  = new EventEmitter();
  var o = new EventEmitter();

  var c = {
    emit: o.emit.bind(o),
    on: i.on.bind(i),
    once: i.once.bind(i),
    in: i,
    out: o
  }

  return c;
}

describe(__filename + "#", function() {

  it("can be created", function() {
    broker(new EventEmitter());
  });

  it("can add a new client", function(next) {
    var c = _fakeClient();
    var master = new EventEmitter();
    var b = broker(master);
    master.emit("connection", c);
    next();
  });

  it("synchronizes data from a client to the main bus", function(next) {
    var bus = mesh.wrap(function(o, n) {
      next();
    });

    var c = _fakeClient();

    var master = new EventEmitter();
    broker(master, bus);
    master.emit("connection", c);

    c.emit("o", mesh.op("abba", { req: 1 }));
  });

  it("dumps data from the main db after the client has disconnected", function(next) {
    var db = {};
    var bus = memory({ db: db });
    var c = _fakeClient();

    var master = new EventEmitter();
    broker(master, bus);
    master.emit("connection", c);
    c.in.emit("o", mesh.op("insert", { req: 1, collection: "a", data: { cid: 1 } }));
    c.in.emit("o", mesh.op("insert", { req: 1, collection: "a", data: { cid: 2 } }));
    c.in.emit("o", mesh.op("insert", { req: 1, collection: "a", data: { cid: 3 } }));
    setTimeout(function() {
      expect(db.a.data.length).to.be(3);
      c.in.emit("disconnect");
      setTimeout(function() {
        expect(db.a.data.length).to.be(0);
        next();
      }, 10);
    }, 10);
  });

  it("synchronizes data from the parent bus to the connected bus", function(next) {
    var ops = [];

    var bus = mesh.tailable(mesh.noop);
    var c = _fakeClient();

    c.out.on("o", function(o) {
      ops.push(o);
    });

    var master = new EventEmitter();
    broker(master, bus);
    master.emit("connection", c);

    bus(mesh.op("tick"));
    bus(mesh.op("tick"));
    bus(mesh.op("tick"));

    setTimeout(function() {
      expect(ops.length).to.be(3);
      next();
    }, 2);
  });
});
