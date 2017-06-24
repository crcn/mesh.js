import { expect } from "chai";
import { DuplexStream, WritableStream, ParallelBus, readAllChunks } from "..";
import { CallbackBus } from "./callback";

describe(__filename + "#", () => {
  it("can be created", () => {
    new ParallelBus([]);
  });

  it("dispatch a message against one entry", async () => {
    let i = 0;
    const bus = new ParallelBus([
      new CallbackBus(m => i++)
    ]);


    bus.dispatch({});
    bus.dispatch({});
    bus.dispatch({});
    expect(i).to.equal(3);
  });

  it("dispatches a message against multiple busses", async () => {
    let i = 0;
    const bus = new ParallelBus([
      new CallbackBus(m => i++),
      new CallbackBus(m => i++),
      new CallbackBus(m => i++)
    ]);

    expect(await readAllChunks(bus.dispatch({}).readable)).to.eql([0, 1, 2]);
  });

  it("Can handle a bus that returns a rejection", async () => {
    let i = 0;
    const bus = new ParallelBus([
      new CallbackBus(m => i++),
      new CallbackBus(m => Promise.reject(new Error("some error")))
    ]);

    let error;
    try {
      await readAllChunks(bus.dispatch({}).readable);
    } catch(e) {
      error = e;
    }

    expect(error).not.to.be.undefined;
    expect(error.message).to.equal("some error");
  });

  it("Can cancel a request", async () => {
    let i = 0;
    const bus = new ParallelBus([
      new CallbackBus(m => i++),
      new CallbackBus(m => i++),
      new CallbackBus(m => i++),
      new CallbackBus(m => i++),
      new CallbackBus(m => i++)
    ]);

    const { readable } = bus.dispatch({});
    const reader = readable.getReader() as ReadableStreamDefaultReader;
    expect(await reader.read()).to.eql({ value: 0, done: false });
    await reader.cancel("no reason");
    expect(i).to.equal(5);
  });


  it("can nest parallel busses", async () => {
    let i = 0;
    const bus = new ParallelBus([
      new ParallelBus([
        new CallbackBus(m => i++),
        new CallbackBus(m => i++),
        new CallbackBus(m => i++)
      ]),
      new CallbackBus(m => i++)
    ]);

    expect(await readAllChunks(bus.dispatch({}).readable)).to.eql([3, 0, 1, 2]);
  });

  it("can write & read transformed data to a request", async () => {
    const bus = new ParallelBus([
      new CallbackBus(m => new DuplexStream((input, output) => {
        const writer = output.getWriter();
        input.pipeTo(new WritableStream({
          write(chunk: number) {
            const p = [];
            for (let i = chunk; i >= 0; i--) {
              p.push(writer.write(i));
            }
            return Promise.all(p);
          },
          close() {
            writer.close();
          }
        }))
      }))
    ]);
    const { writable, readable } = bus.dispatch({});
    const writer = writable.getWriter();
    await writer.write(1);
    await writer.write(2);
    await writer.close();

    expect(await readAllChunks(readable)).to.eql([1, 0, 2, 1, 0]);
  });
});