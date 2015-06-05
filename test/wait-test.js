var mesh   = require("../");
var expect = require("expect.js");

describe(__filename + "#", function() {
  it("can wait for a callback before passing an operation to a bus", function(next) {

    var waitCount = 0;

    var bus = mesh.wait(function(next) {
      waitCount++;
      setTimeout(next, 10);
    }, mesh.wrap(function(operation, next) {
      expect(waitCount).to.be(1);
      next(void 0, "data");
    }));

    bus({})
    .on("data", function(data) {
      expect(data).to.be("data");
      next();
    });
  });

  it("ends the stream if the wait function errors", function(next) {

    var busHandleCount = 0;

    var bus = mesh.wait(function(next) {
      next(new Error("error!"));
    }, mesh.wrap(function(operation, next) {
      busHandleCount++;
      next();
    }));

    bus({})
    .on("error", function(error) {
      setTimeout(function() {
        expect(error.message).to.be("error!");
        expect(busHandleCount).to.be(0);
        next();
      }, 50);
    });
  });
});
