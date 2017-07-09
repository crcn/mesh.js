import { expect } from "chai";
import { parallel, readAll } from ".";

describe(__filename + "#", () => {
  it("can be created", () => {
    parallel();
  });

  it("dispatch a message against one entry", async () => {
    let i = 0;
    const dispatch = parallel(
      m => i++
    );

    dispatch({}).next();
    dispatch({}).next();
    dispatch({}).next();
    expect(i).to.equal(3);
  });

  it("dispatches messages in parallel", async () => {
    let i = 0;
    const dispatch = parallel(
      m => i++,
      m => i++,
      m => i++
    );

    dispatch({}).next();
    expect(i).to.eql(3);
  });

  it("dispatches a message against multiple dispatchers", async () => {
    let i = 0;
    const dispatch = parallel(
      m => i++,
      m => i++,
      m => i++
    );

    expect(await readAll(dispatch({}))).to.eql([0, 1, 2]);
  });

  it("Can handle a dispatch that returns a rejection", async () => {
    let i = 0;
    const dispatch = parallel(
      m => i++,
      m => Promise.reject(new Error("some error"))
    );

    let error;
    try {
      await readAll(dispatch({}));
    } catch(e) {
      error = e;
    }

    expect(error).not.to.be.undefined;
    expect(error.message).to.equal("some error");
  });


  it("can nest parallel dispatches", async () => {
    let i = 0;
    const dispatch = parallel(
      parallel(
        m => i++,
        m => i++,
        m => i++
      ),
      m => i++
    );

    expect(await readAll(dispatch({}))).to.eql([0, 1, 2, 3]);
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