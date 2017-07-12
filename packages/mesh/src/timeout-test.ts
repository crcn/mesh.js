import { timeout as _timeout } from "./test";
import { expect } from "chai";
import { timeout, sequence, readAll } from "./index";

const timeoutQuick = (fn: Function, createError?) => timeout(fn, 4, createError);

describe(__filename + "#", () => {

  it("can return yielded values from a target function", async () => {
    const t = timeoutQuick(a => a + 1);
    expect(await readAll(t(1))).to.eql([2]);
  }); 

  it("can return yielded values from a sequence", async () => {
    const t = timeoutQuick(
      sequence(a => a + 1, b => b + 2, c => c + 3)
    );
    expect(await readAll(t(1))).to.eql([2, 3, 4]);
  }); 

  it("can timeout", async () => {
    const t = timeoutQuick(
      sequence(a => a + 1, b => b + 2, c => c + 3)
    );
    const iter = t(1);
    await _timeout(2);

    try {
      expect(await readAll(iter)).to.eql([2, 3, 4]);
    } catch(e) {
      expect(e.message).to.eql("Timeout calling function.");
    }
  }); 

  it("can use a custom error message", async () => {
    const t = timeoutQuick(
      sequence(a => a + 1, b => b + 2, c => c + 3),
      (...args) => new Error(`Timeout calling "${args.join(", ")}".`)
    );
    const iter = t(1);
    await _timeout(10);

    try {
      expect(await readAll(iter)).to.eql([2, 3, 4]);
    } catch(e) {
      expect(e.message).to.eql(`Timeout calling "1".`);
    }
  }); 

  it("clears the timeout after each next() call", async () => {
    const t = timeoutQuick(
      sequence(a => a + 1, b => b + 2, c => c + 3)
    );

    const iter = t(1);
    await _timeout(0);
    expect(await iter.next()).to.eql({ value: 2, done: false });
    await _timeout(0);
    expect(await iter.next()).to.eql({ value: 3, done: false });
    await _timeout(0);
    expect(await iter.next()).to.eql({ value: 4, done: false });

    try {
      await _timeout(10);
      await iter.next();
    } catch(e) {
      expect(e.message).to.eql("Timeout calling function.");
    }
  }); 

  it("re-throws an error from the target function", async () => {
    const t = timeoutQuick(
      function*() {
        throw new Error("some error");
      }
    );
    let err: Error;
    const iter = t();
    try {
      await iter.next();
    } catch(e) {
      err = e;
    }

    expect(err.message).to.eql("some error");
  });
});
