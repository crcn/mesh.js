import { expect } from "chai";
import { parallel, readAll } from ".";

describe(__filename + "#", () => {
  it("can be created", () => {
    parallel();
  });

  it("call a message against one entry", async () => {
    let i = 0;
    const fn = parallel(
      m => i++
    );

    fn({}).next();
    fn({}).next();
    fn({}).next();
    expect(i).to.equal(3);
  });

  it("calls messages in parallel", async () => {
    let i = 0;
    const fn = parallel(
      m => i++,
      m => i++,
      m => i++
    );

    fn({}).next();
    expect(i).to.eql(3);
  });

  it("calls a message against multiple functions", async () => {
    let i = 0;
    const fn = parallel(
      m => i++,
      m => i++,
      m => i++
    );

    expect(await readAll(fn({}))).to.eql([0, 1, 2]);
  });

  it("Can handle a call that returns a rejection", async () => {
    let i = 0;
    const fn = parallel(
      m => i++,
      m => Promise.reject(new Error("some error"))
    );

    let error;
    try {
      await readAll(fn({}));
    } catch(e) {
      error = e;
    }

    expect(error).not.to.be.undefined;
    expect(error.message).to.equal("some error");
  });


  it("can nest parallel functions", async () => {
    let i = 0;
    const fn = parallel(
      parallel(
        m => i++,
        m => i++,
        m => i++
      ),
      m => i++
    );

    expect(await readAll(fn({}))).to.eql([0, 1, 2, 3]);
  });

  it("can pass multiple arguments", async () => {
    let i = 0;
    const add = parallel(
      (a, b) => a + b,
      (a, b) => a + b
    ) as (a: number, b: number) => AsyncIterableIterator<number>;

    expect(await readAll(add(1, 2))).to.eql([3, 3]);
  });
});