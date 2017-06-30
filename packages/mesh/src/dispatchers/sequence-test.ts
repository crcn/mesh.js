import { expect } from "chai";
import { createSequenceDispatcher } from "..";
import { timeout } from "../test";

describe(__filename + "#", () => {
  it("can dispatch a message to multiple endpoints in sequence", async () => {
    let i = 0;

    const dispatch = createSequenceDispatcher([
      m => i++,
      m => i++,
      m => i++
    ]);

    const iterable = dispatch({});
    expect((await iterable.next()).value).to.eql(0);
    expect((await iterable.next()).value).to.eql(1);
    expect((await iterable.next()).value).to.eql(2);
  });
  
  it("can yield all values from targets", async () => {
    let i = 0;

    const dispatch = createSequenceDispatcher([
      function *(m) {
        yield "a";
        yield "b";
      },
      function*(m) {
        yield "c";
        yield "d";
      },
      function*(m) {
        yield "e";
        yield "f";
      }
    ]);

    const iterable = dispatch({});
    expect((await iterable.next()).value).to.eql("a");
    expect((await iterable.next()).value).to.eql("b");
    expect((await iterable.next()).value).to.eql("c");
    expect((await iterable.next()).value).to.eql("d");
    expect((await iterable.next()).value).to.eql("e");
    expect((await iterable.next()).value).to.eql("f");
    expect((await iterable.next()).done).to.eql(true);
  });

  it("ignores returned values from target dispatchers", async () => {
    const dispatch = createSequenceDispatcher([
      function *(m) {
        yield "a";
        yield "b";
        return "c";
      }
    ]);
    const iterable = dispatch({});
    expect((await iterable.next()).value).to.eql("a");
    expect((await iterable.next()).value).to.eql("b");
    expect((await iterable.next()).value).to.eql(undefined);
  });

  it("can use a function that returns an array of target dispatchers", async () => {
    const dispatch = createSequenceDispatcher(() => [
      function*() { yield "a"; },
      function*() { yield "b"; }
    ]);

    const iterable = dispatch({});
    expect((await iterable.next()).value).to.eql("a");
    expect((await iterable.next()).value).to.eql("b");
    expect((await iterable.next()).done).to.eql(true);
  });
});