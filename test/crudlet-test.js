var crudlet = require("../");
var expect  = require("expect.js");
var through = require("through2")

describe(__filename + "#", function() {
  it("can create a crudlet", function() {
    crudlet();
  });

  it("passes a new operation to the database in the crudlet", function(next) {

    function db() {
      return through.obj(function(operation, enc, next) {
        next();
      });
    }

    var stream = crudlet(db)("insert", { data: "abba"});
    stream.on("data", function() {});
    stream.on("end", function() {
      next();
    });
  });


  it("can pass an operation to the run() command", function(next) {
      function db() {
        return through.obj(function(operation, enc, next) {
          next();
        });
      }

      var stream = crudlet(db)(crudlet.operation("insert", { data: "abba" }));
      stream.on("data", function() {});
      stream.on("end", function() {
        next();
      });
  });

  it("can write an operation to a crudlet", function(next) {
      function db() {
        return through.obj(function(operation, enc, next) {
          expect(operation.name).to.be("insert");
          next();
        });
      }

      var op = crudlet.operation("insert", { data: "abba" });
      var stream = crudlet(db)();
      stream.end(op);
      stream.on("data", function() {});
      stream.on("end", function() {
        next();
      });
  });

  it("can write data to the stream", function(next) {
    function db() {
      return through.obj(function(operation, enc, next) {
        this.push({ name: "abba" });
        next();
      });
    }

    var stream = crudlet(db)("insert");

    stream.on("data", function(data) {
      expect(data.name).to.be("abba");
      next();
    });
  });


  it("emits an error if the next param gets an error", function(next) {
    function db() {
      return through.obj(function(operation, enc, next) {
        next(new Error("abba"));
      });
    }

    crudlet(db)("insert").once("error", function (err) {
      expect(err.message).to.be("abba");
      next();
    });
  });
});
