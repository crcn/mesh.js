var mesh   = require("../");
var expect = require("expect.js");

describe(__filename + "#", function() {

  it("can retry a bus twice if an operation fails", function(next) {
    var tryCount = 0;

    var bus = mesh.retry(2, mesh.wrap(function(operation, next) {
      tryCount++;
      next(new Error("fail"));
    }));

    bus({}).on("error", function(err) {
      expect(tryCount).to.be(2);
      next();
    });
  });

  it("doesn't retry a bus if data is emitted before an error", function(next) {

    var tryCount = 0;

    var bus = mesh.retry(5, mesh.stream(function(operation, stream) {
      tryCount++;
      stream.write("data");
      stream.emit("error", new Error("error!"));
      stream.end();
    }));

    var chunk;

    bus({})
    .on("data", function(data) {
      chunk = data;
    })
    .on("error", function(err) {
      expect(chunk).to.be("data");
      expect(tryCount).to.be(1);
      next();
    });
  });

  it("can setup a condition for errors before retrying", function(next) {
    var tryCount = 0;
    function testError(error) {
      return error.message !== "count 2";
    }

    var bus = mesh.retry(10, testError, mesh.wrap(function(operation, next) {
      tryCount++;
      next(new Error("count " + tryCount));
    }));

    bus({})
    .on("error", function(err) {
      expect(tryCount).to.be(2);
      next();
    });
  });
});
