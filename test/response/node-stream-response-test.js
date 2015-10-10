import { Response, NodeStreamResponse } from "../..";
import fs from "fs";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {
  it("is a response", function() {
    expect(new NodeStreamResponse()).to.be.an(Response);
  });

  it("can stream chunks of a file", co.wrap(function*() {

    var stream = fs.createReadStream(__dirname + "/fixtures/test-file.txt");
    var response = new NodeStreamResponse(fs.createReadStream(__dirname + "/fixtures/test-file.txt"));
    var buffer = [];
    var value;
    var done;
    while(({ value, done } = (yield response.read())) && !done) {
      buffer.push(value);
    }

    expect(buffer.join("")).to.be("a b c d e\n");
  }));
});
