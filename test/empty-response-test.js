import { EmptyResponse } from "..";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {

  it("returns undefined when read is called", co.wrap(function*() {
    var response = new EmptyResponse();

    // sanity check to ensure read() never returns a value
    for (var i = 10; i--;) {
      expect((yield response.read()).done).to.be(true);
    }
  }));

  it("calls then() immediately after it's called", co.wrap(function*() {
    var response = new EmptyResponse();
    yield new Promise(function(resolve, reject) {
      response.then(resolve);
    });
  }));

  it("can be yielded", co.wrap(function*() {
    var response = new EmptyResponse();
    yield response;
    yield response;
    yield response;
    yield response;
  }));
});
