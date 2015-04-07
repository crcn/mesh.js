var mesh = require("../");
var expect  = require("expect.js");
var through = require("through2");
var _       = require("highland");
var ss      = require("obj-stream");

describe(__filename + "#", function() {

  it("passes a new operation to the database in the mesh", function(next) {

    function db(operation) {
      expect(operation.data).to.be("a");
      return _([]);
    }

    mesh.clean(db)("insert", { data: "a" }).on("data", function() { }).on("end", next);
  });

  it("can properly handle errors", function(next) {
    function db(operation) {
      var stream = ss.writable();
      process.nextTick(function() {
        stream.reader.emit("error", new Error("err"));
      });
      return stream.reader;
    }

    db(mesh.op("insert")).pipe(_.pipeline(_.collect)).on("error", function() {
      next();
    });
  });

  it("can write data to the stream", function(next) {
    function db(operation) {
      return _([{a:1}]);
    }

    mesh.clean(db)("insert").on("data", function(data) {
      expect(data.a).to.be(1);
    }).on("end", next);
  });

  it("emits an error if the next param gets an error", function(next) {
    function db(operation) {
      var writer = ss.writable();
      process.nextTick(function() {
        writer.reader.emit("error", new Error("abba"));
      });
      return writer.reader;
    }

    db(mesh.operation("insert")).once("error", function(err) {
      expect(err.message).to.be("abba");
      next();
    });
  });
});
