var mesh   = require("../");
var expect = require("expect.js");

describe(__filename + "#", function() {

  it("can timeout a bus after N ms", function() {
    var bus = mesh.timeout(10, mesh.wrap(function(operation, next) {
      setTimeout(next, 100);
    }));

    bus({}).on("error", function(error) {
      expect(error.message).to.contain("timeout");
    });
  });

  it("stops the timer if a bus emits data before timeout", function(next) {

    var bus = mesh.timeout(10, mesh.stream(function(operation, stream) {
      stream.write("data");
    }));

    var chunk;
    var error;

    bus({})
    .on("data", function(data) {
      chunk = data;
    })
    .on("error", function(err) {
      error = err;
    });

    setTimeout(function() {
      expect(chunk).to.be("data");
      expect(error).to.be(void 0);
      next();
    }, 100);
  });

  it("stops the timer if a bus emits end before timeout", function(next) {

    var bus = mesh.timeout(10, mesh.stream(function(operation, stream) {
      stream.end();
    }));

    var chunk;
    var error;

    bus({})
    .on("error", function(err) {
      error = err;
    });

    setTimeout(function() {
      expect(error).to.be(void 0);
      next();
    }, 100);
  });
});
