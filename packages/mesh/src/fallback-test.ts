import { expect } from "chai";
import { readAll, pipe, through, fallback } from "./index";

describe(__filename + "#", () => {
  it("can be created", () => {
    fallback();
  });
  it("can return values from the first function", async () => {
    const fn = fallback(
      m => "a"
    );
    
    expect(await readAll(fn({}))).to.eql(["a"]);
  });

  it("can return values from the second function if the first doesn't return anything", async () => {
    const fn = fallback(
      m => undefined,
      m => "b"
    );
    
    expect(await readAll(fn({}))).to.eql(["b"]);
  });

  it("can return all yields from the first function, and not the rest", async () => {
    const fn = fallback(
      function*() {
        yield "a";
        yield "b";
        yield "c";
      },
      m => "d"
    );
    
    expect(await readAll(fn({}))).to.eql(["a", "b", "c"]);
  });

  it("can take input data", async () => {
    const fn = fallback(
      m => through(a => -a),
      m => "d"
    );
    
    expect(await readAll(pipe([1, 2, 3], fn({})))).to.eql([-1, -2, -3]);
  });

  it("passes errors from target functions to async generator promises", async () => {
    const fn = fallback(
      function*() {
        yield 1;
        throw new Error("some error");
      }
    );

    const iter = fn();
    expect(await iter.next()).to.eql({ value: 1, done: false });
    let err: Error;

    try {
      await iter.next();
    } catch(e) {
      err = e;
    } 

    expect(err.message).to.eql("some error");
  });


  it("runs the next target if the first throws an error immediately", async () => {
    const fn = fallback(
      function*() {
        throw new Error("some error");
      },
      function*() {
        yield 1;
      }
    );

    const iter = fn();
    expect(await iter.next()).to.eql({ value: 1, done: false });
    expect(await iter.next()).to.eql({ value: undefined, done: true });
  });

  it("throws an error if the first target yields a value then throws an error", async () => {
    const fn = fallback(
      function*() {
        yield 1;
        throw new Error("some error");
      },
      function*() {
        yield 2;
      }
    );

    const iter = fn();
    expect(await iter.next()).to.eql({ value: 1, done: false });
    let err: Error;

    try {
      await iter.next();
    } catch(e) {
      err = e;
    } 

    expect(err.message).to.eql("some error");
  });
});