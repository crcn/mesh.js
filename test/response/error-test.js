import { ErrorResponse } from "../..";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {
  it("returns an error", co.wrap(function*() {
    var resp = new ErrorResponse(new Error("an error"));
    var err;
    try {
      yield resp.read();
    } catch(e) { err = e; }
    expect(err.message).to.be("an error");
  }));
});
