var ReadableStream = require("../../internal/stream/readable");
var co = require("co");

describe(__filename + "#", function() {
  it("can be created", function() {
    new ReadableStream();
  });
});
