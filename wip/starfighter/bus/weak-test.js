var weak   = require("./weak");
var memory = require("mesh-memory");
var mesh   = require("mesh");
var expect = require("expect.js");

describe(__filename + "#", function() {

  it("can be created", function() {
    weak();
  });

  it("can pass operations from bus A to bus B", function(next) {
    var bus = weak(mesh.wrap(function(operation) {
      expect(operation.data.name).to.be("abba");
      next();
    }));

    bus(mesh.op("insert", { collection: "a", data: { cid: 1, name: "abba"}}));
  });

  it("removes data that has been added to the weak ref", function(next) {
    var db = {};

    var bus = weak(mesh.limit(1, memory({ db: db })));

    bus(mesh.op("insert", { collection: "a", data: { cid: 1, name: "abba"}}));
    bus(mesh.op("insert", { collection: "a", data: { cid: 1, name: "abba"}}));
    bus(mesh.op("insert", { collection: "a", data: { cid: 1, name: "abba"}})).on("end", function() {
      expect(db.a.data.length).to.be(3);
      bus(mesh.op("dispose")).on("end", function() {
        setTimeout(function() {
          expect(db.a.data.length).to.be(0);
          next();
        }, 100);
      });
    });
  });
});
