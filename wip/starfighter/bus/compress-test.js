var compress = require("./compress");
var expect = require("expect.js");

describe(__filename + "#", function() {

  it("can compress & uncompress an operation", function() {
    var unpacked = compress.unpack(compress.pack({ name: "insert" }));
    expect(unpacked.name).to.be("insert");
  });

  it("can compress & uncompress an operation with data", function() {
    var unpacked = compress.unpack(compress.pack({
      name: "insert",
      data: {
        type: "ship",
        cid: "fdssdfsdfsdfsdf",
        x: 100,
        y: 100,
        rotation: 180
      }
    }));

    expect(unpacked.data.cid).to.be("fdssdfsdfsdfsdf");
  });

  it("can compress & uncompress an operation with integers", function() {
    var unpacked = compress.unpack(compress.pack({
      name: "insert",
      resp: 0
    }));

    expect(unpacked.resp).to.be(0);
  });
});
