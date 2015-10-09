import { AsyncResponse, Response } from "../..";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {

  it("is a Response", function() {
    expect(new AsyncResponse()).to.be.an(Response);
  });

  it("read() chunks immediately if they exist", co.wrap(function*() {
    var response = new AsyncResponse();

    response.write("a");
    response.write("b");
    response.end();

    var ret = co(function*() {
      expect((yield response.read()).value).to.be("a");
      expect((yield response.read()).value).to.be("b");
      expect((yield response.read()).value).to.be(void 0);
    });

    yield ret;
  }));

  it("read() waits until write() data exists", co.wrap(function*() {
    var response = new AsyncResponse();

    var ret = co(function*() {
      expect((yield response.read()).value).to.be("a");
      expect((yield response.read()).value).to.be("b");
      expect((yield response.read()).value).to.be(void 0);
    });

    response.write("a");
    response.write("b");
    response.end();

    yield ret;
  }));

  it("can end() with a chunk", co.wrap(function*() {
    var response = new AsyncResponse();

    var ret = co(function*() {
      expect((yield response.read()).value).to.be("a");
      expect((yield response.read()).value).to.be("b");
      expect((yield response.read()).value).to.be(void 0);
    });

    response.write("a");
    response.end("b");

    yield ret;
  }));

  it("runs the provided callback function in the constructor", co.wrap(function*() {
    var response = new AsyncResponse(function(response) {
      response.write("a");
      response.end("b");
    });

    expect((yield response.read()).value).to.be("a");
    expect((yield response.read()).value).to.be("b");
    expect((yield response.read()).value).to.be(void 0);
  }));

  it("can continue to read after the response has ended", co.wrap(function*() {
    var response = new AsyncResponse(function(response) {
      response.end();
    });
    yield response.read();
    yield response.read();
    yield response.read();
    yield response.read();
  }));

  it("can pass an error down", co.wrap(function*() {
    var response = new AsyncResponse(function(response) {
      response.error(new Error("something went wrong"));
    });

    var err;

    try {
      yield response.read();
    } catch (e) { err = e; }

    expect(err.message).to.be("something went wrong");
  }));

  it("can continue to read chunks after an error has been emitted", co.wrap(function*() {
    var response = new AsyncResponse(function(response) {
      response.error(new Error("something went wrong"));
      response.end("chunk");
    });

    var err;

    try {
      yield response.read();
    } catch (e) { err = e; }

    expect(err.message).to.be("something went wrong");
    expect((yield response.read()).value).to.be("chunk");
    expect((yield response.read()).value).to.be(void 0);
  }));
});
