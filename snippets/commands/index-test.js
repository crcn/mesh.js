var assert   = require("assert");
var commands = require("./index");
var mesh     = require("mesh");

describe(__filename + "#", function() {

  it("can register a command", function() {
    commands({
      popup: function() {

      }
    });
  });

  xit("can execute a command and receive a result", function(next) {
    var bus = commands({
      execute: function(operation, next) {
        next(void 0, true);
      }
    });
    bus({name:"execute"}).on("data", function(data) {
      assert.equal(data, true);
      next();
    });
  });

  it("can define a command as a bus", function(next) {

    var bus = commands({
      execute: mesh.stream(function(operation, stream) {
        stream.end(true);
      })
    });

    bus({name:"execute"}).on("data", function(data) {
      assert.equal(data, true);
      next();
    });
  });

  it("can return a bus if args length is 1", function(next) {

    var bus = commands({
      execute: function(operation) {
        return mesh.stream(function(operation, stream) {
          stream.end(true);
        })(operation);
      }
    });

    bus({name:"execute"}).on("data", function(data) {
      assert.equal(data, true);
      next();
    });
  });
});
