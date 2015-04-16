var mesh = require("../");
var expect  = require("expect.js");
var through = require("through2");
var _       = require("highland");
var ss      = require("obj-stream");

describe(__filename + "#", function() {

  it("can run a bus operation", function(next) {

    function bus(operation) {
      expect(operation.data.a).to.be(1);
      return _([1, 2]);
    }

    mesh.run(bus, "insert", { data: { a: 1}}, function(err, data) {
      expect(data).to.be(1);
      next();
    });
  });

  it("can run a bus operation and load multiple items", function(next) {

    function bus(operation) {
      expect(operation.data.a).to.be(1);
      return _([1, 2]);
    }

    mesh.run(bus, "insert", { multi: true, data: { a: 1}}, function(err, data) {
      expect(data.length).to.be(2);
      expect(data[0]).to.be(1);
      expect(data[1]).to.be(2);
      next();
    });
  });

  it("can run a bus operation and handle an error", function(next) {

    function bus(operation) {
      var stream = ss.writable();
      process.nextTick(function() {
        stream.reader.emit("error", new Error("err"));
      });
      return stream.reader;
    }

    mesh.run(bus, "insert", { multi: true, data: { a: 1}}, function(err, data) {
      expect(err.message).to.be("err");
      next();
    });
  });

});
