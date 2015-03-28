var crudlet = require("../");
var expect  = require("expect.js");
var through = require("through2");

describe(__filename + "#", function() {

  it("passes a new operation to the database in the crudlet", function(next) {

    function db() {
      return through.obj(function(operation, enc, next) {
        next();
      });
    }

    var stream = db();
    stream.on("data", function() {});
    stream.on("end", function() {
      next();
    });
    stream.end(crudlet.operation("insert", { data: "abba"}));
  });

  it("can write an operation to a crudlet", function(next) {
    function db() {
      return through.obj(function(operation, enc, next) {
        expect(operation.name).to.be("insert");
        next();
      });
    }

    var op = crudlet.operation("insert", { data: "abba" });
    var stream = db();
    stream.on("data", function() {});
    stream.on("end", function() {
      next();
    });

    stream.end(op);
  });

  it("can write data to the stream", function(next) {
    function db() {
      return through.obj(function(operation, enc, next) {
        this.push({ name: "abba" });
        next();
      });
    }
    var stream = db();

    stream.on("data", function(data) {
      expect(data.name).to.be("abba");
      next();
    });

    stream.end(crudlet.operation("insert"));
  });

  it("emits an error if the next param gets an error", function(next) {
    function db() {
      return through.obj(function(operation, enc, next) {
        next(new Error("abba"));
      });
    }

    var stream = db();

    stream.once("error", function(err) {
      expect(err.message).to.be("abba");
      next();
    });

    stream.end(crudlet.operation("insert"));
  });
});
