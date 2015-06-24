var mesh   = require("../");
var expect = require("expect.js");

describe(__filename + "#", function() {

  it("can buffer a stream of data, then re-emit that data when the stream has ended", function(next) {
    var buffer = [];

    var bus = mesh.buffer(mesh.stream(function(operation, stream) {
      stream.write("two");
      stream.write("chunks");
      stream.end();
    }));

    bus({})
    .on("data", buffer.push.bind(buffer))
    .on("end", function() {
      expect(buffer.join(" ")).to.be("two chunks");
      next();
    });
  });

  it("fails if a stream emits an error after data is emitted", function(next) {
    var buffer = [];

    var bus = mesh.buffer(mesh.stream(function(operation, stream) {
      stream.write("two");
      stream.write("chunks");
      stream.emit("error", new Error("failed"));
    }));

    bus({})
    .on("data", buffer.push.bind(buffer))
    .on("error", function(error) {
      expect(buffer.join(" ")).to.be("");
      expect(error.message).to.be("failed");
      next();
    });
  });
});
