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

    expect(await readAll(dispatch({}))).to.eql([3, 0, 1, 2]);
  });

  // it("can write & read transformed data to a request", async () => {
  //   const dispatch = createParallelDispatcher([
  //     m => new DuplexStream((input, output => {
  //       const writer = output.getWriter();
  //       input.pipeTo(new WritableStream({
  //         write(chunk: number) {
  //           const p = [];
  //           for (let i = chunk; i >= 0; i--) {
  //             p.push(writer.write(i));
  //           }
  //           return Promise.all(p);
  //         },
  //         close() {
  //           writer.close();
  //         }
  //       }))
  //     }))
  //   ]);
  //   const { writable, readable } = dispatch({});
  //   const writer = writable.getWriter();
  //   await writer.write(1);
  //   await writer.write(2);
  //   await writer.close();

  //   expect(await readAllChunks(readable)).to.eql([1, 0, 2, 1, 0]);
  // });
});