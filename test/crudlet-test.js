var meshlet = require("../");
var expect  = require("expect.js");
var through = require("through2");
var _       = require("highland");
var ss      = require("obj-stream");

describe(__filename + "#", function() {

  it("passes a new operation to the database in the meshlet", function(next) {

    function db(operation) {
      expect(operation.data).to.be("a");
      return _([]);
    }

    meshlet.clean(db)("insert", { data: "a" }).on("data", function() { }).on("end", next);
  });

  it("can write data to the stream", function(next) {
    function db(operation) {
      return _([{a:1}]);
    }

    meshlet.clean(db)("insert").on("data", function(data) {
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

    db(meshlet.operation("insert")).once("error", function(err) {
      expect(err.message).to.be("abba");
      next();
    });
  });
});
