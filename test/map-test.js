var mesh = require("../");
var expect  = require("expect.js");
var _ = require("highland");

describe(__filename + "#", function() {
  it("can map data into something else", function(next) {

    var bus = mesh.wrap(function(operation, next) {
      next(void 0, operation.name);
    });

    bus = mesh.map(bus, function(operation, data, stream) {
      data.split("").forEach(stream.write.bind(stream));
      stream.end();
    });

    bus(mesh.op("hello"))
      .pipe(_.pipeline(_.collect))
      .on("data", function(data) {
        expect(data.length).to.be(5);
        expect(data[0]).to.be("h");
        expect(data[1]).to.be("e");
        expect(data[2]).to.be("l");
        expect(data[3]).to.be("l");
        expect(data[4]).to.be("o");
        next();
      });
  });
});
