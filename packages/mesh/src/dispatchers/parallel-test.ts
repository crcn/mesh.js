import { expect } from "chai";
import { createParallelDispatcher, readAll } from "..";

describe(__filename + "#", () => {
  it("can be created", () => {
    createParallelDispatcher([]);
  });

  it("dispatch a message against one entry", async () => {
    let i = 0;
    const dispatch = createParallelDispatcher([
      m => i++
    ]);

    dispatch({}).next();
    dispatch({}).next();
    dispatch({}).next();
    expect(i).to.equal(3);
  });

  it("dispatches messages in parallel", async () => {
    let i = 0;
    const dispatch = createParallelDispatcher([
      m => i++,
      m => i++,
      m => i++
    ]);

    dispatch({}).next();
    expect(i).to.eql(3);
  });

  it("dispatches a message against multiple dispatchers", async () => {
    let i = 0;
    const dispatch = createParallelDispatcher([
      m => i++,
      m => i++,
      m => i++
    ]);

    expect(await readAll(dispatch({}))).to.eql([0, 1, 2]);
  });

  it("Can handle a dispatch that returns a rejection", async () => {
    let i = 0;
    const dispatch = createParallelDispatcher([
      m => i++,
      m => Promise.reject(new Error("some error"))
    ]);

    let error;
    try {
      await readAll(dispatch({}));
    } catch(e) {
      error = e;
    }

    expect(error).not.to.be.undefined;
    expect(error.message).to.equal("some error");
  });


  it("can nest parallel dispatchses", async () => {
    let i = 0;
    const dispatch = createParallelDispatcher([
      createParallelDispatcher([
        m => i++,
        m => i++,
        m => i++
      ]),
      m => i++
    ]);

    expect(await readAll(dispatch({}))).to.eql([0, 1, 2, 3]);
  });
});