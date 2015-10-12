var mesh = require("../..");

var Response = mesh.Response;
var NodeStreamResponse = mesh.NodeStreamResponse;
var fs = require("fs");
var co = require("co");
var expect = require("expect.js");

describe(__filename + "#", function() {
  it("is a response", function() {
    expect(new NodeStreamResponse()).to.be.an(Response);
  });

  it("can stream chunks of a file", co.wrap(function*() {

    var stream = fs.createReadStream(__dirname + "/fixtures/test-file.txt");
    var response = new NodeStreamResponse(fs.createReadStream(__dirname + "/fixtures/test-file.txt"));
    var buffer = [];
    var chunk;
    while((chunk = (yield response.read())) && !chunk.done) {
      buffer.push(chunk.value);
    }

    expect(buffer.join("")).to.be("a b c d e\n");
  }));

  it("calls then() after finishing", co.wrap(function*() {

    var stream = fs.createReadStream(__dirname + "/fixtures/test-file.txt");
    var response = new NodeStreamResponse(fs.createReadStream(__dirname + "/fixtures/test-file.txt"));
    var buffer = [];


    var chunk;
    while((chunk = (yield response.read())) && !chunk.done) {
      buffer.push(chunk.value);
    }

    // return respnse as thenable
    return response;
  }));
});
