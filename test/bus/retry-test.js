import { Bus, RetryBus, BufferedBus, ErrorResponse, AcceptBus } from "../..";
import sift from "sift";
import expect from "expect.js";
import co from "co";

describe(__filename + "#", function() {

  it("is a bus", function() {
    expect(new RetryBus()).to.be.an(Bus);
  });

  it("can retry an operation twice if it fails", co.wrap(function*() {

    var retryCount = 0;

    var bus = new RetryBus(
      2,
      {
        execute: function(operation) {
          retryCount++;
          return new ErrorResponse(new Error("an error"));
        }
      }
    );

    var response = bus.execute({ name: "op" });

    try { yield response.read() } catch(e) { }

    expect(retryCount).to.be(2);
  }));

  xit("can filter errors before retrying", co.wrap(function*() {


    var bus = new RetryBus(
      3,
      function(error, operation) {
        return error.message.to.be("network error");
      },
      new FallbackBus(
        new AcceptBus(sift({ name: "getGenericError" }), new BufferedBus(new Error("generic error"))),
        new AcceptBus(sift({ name: "getNetworkError" }), new BufferedBus(new Error("network error")))
      )
    );

    var response = bus.execute({ name: "op" });

    try { yield response.read() } catch(e) { }

    expect(retryCount).to.be(2);
  }));
});
