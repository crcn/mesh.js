import { expect } from "chai";
import { EventEmitter } from "events";
import { RemoteBus, NoopDispatcher, CallbackDispatcher, readAllChunks, DuplexStream, TransformStream } from "@tandem/mesh";

describe(__filename + "#", () => {

  const createOptions = (family?: string, input?: EventEmitter, output?: EventEmitter) => {
    if (!input || !output) {
      input = output = new EventEmitter();
    }
    return {
      family: family,
      testMessage: () => true,
      adapter: {
        addListener : input.on.bind(input, "message"),
        send        : output.emit.bind(output, "message")
      }
    }
  }

  it("can send and receive a remote message", async () => {

    const abus = new RemoteBus(createOptions(), new CallbackDispatcher(({ text }) => {
      return text.toUpperCase();
    }));

    const bbus = new RemoteBus(abus);

    expect(await readAllChunks(bbus.dispatch({ text: "hello" }))).to.eql(["HELLO"]);
  });

  it("can send and receive a remote stream", async () => {

    const abus = new RemoteBus(createOptions(), new CallbackDispatcher(({ text }) => {
      return new TransformStream({
        start(controller) {
          text.split("").forEach(chunk => controller.enqueue(chunk));
          controller.close();
        }
      })
    }));


    const bbus = new RemoteBus(abus);

    expect(await readAllChunks(bbus.dispatch({ text: "hello" }))).to.eql(["h", "e", "l", "l", "o"]);
  });

  it("can write chunks to a remote stream", async () => {
    const abus = new RemoteBus(createOptions(), new CallbackDispatcher((message: any) => {
      return new TransformStream({
        transform(chunk: string, controller) {
          controller.enqueue(chunk.toUpperCase());
        }
      })
    }));

    const bbus = new RemoteBus(abus);

    const { writable, readable } = bbus.dispatch({});
    const writer = writable.getWriter();
    writer.write("a");
    writer.write("b");
    writer.write("c");
    await writer.write("d");
    writer.close();

    expect(await readAllChunks(readable)).to.eql(["A", "B", "C", "D"]);
  });

  it("can abort a remote stream", async () => {
    const abus = new RemoteBus(createOptions(), new CallbackDispatcher((message: any) => {
      return new TransformStream({
        transform(chunk: string, controller) {
          controller.enqueue(chunk.toUpperCase());
        }
      })
    }));
    const bbus = new RemoteBus(abus);

    const { writable, readable } = bbus.dispatch({});
    const writer = writable.getWriter();
    const reader = readable.getReader();
    writer.write("a").catch(e => {});
    writer.write("b").catch(e => {});
    writer.write("c").catch(e => {});
    await writer.abort(new Error("Cannot write anymore"));

    let error;

    try {
      await reader.read();
    } catch(e) {
      error = e;
    }

    expect(error.message).to.equal("Writable side aborted");
  });

  it("can cancel a read stream", async () => {

    const abus = new RemoteBus(createOptions(), new CallbackDispatcher(({ text }) => {
      return new TransformStream({
        start(controller) {
          text.split("").forEach(chunk => controller.enqueue(chunk.toUpperCase()));
        }
      })
    }));
    const bbus = new RemoteBus(abus);

    const { writable, readable } = bbus.dispatch({ text: "abcde" });
    const reader = readable.getReader();
    expect((await reader.read()).value).to.equal("A");
    expect((await reader.read()).value).to.equal("B");
    expect((await reader.read()).value).to.equal("C");
    reader.cancel("not interested");
    expect((await reader.read()).done).to.equal(true);
  });


  it("doesn\'t get re-dispatched against the same remote bus", async () => {
    let i = 0;
    const abus = new RemoteBus(createOptions(), new CallbackDispatcher((message: string) => {
      i++;
      return abus.dispatch(message);
    }));
    const bbus = new RemoteBus(abus);

    const { writable, readable } = bbus.dispatch({});
    expect(i).to.equal(1);
  });

  it("gets re-dispatched against other remote busses", async () => {
    let i = 0;
    const abus = new RemoteBus(createOptions(), new CallbackDispatcher((message: string) => {
      i++;
      return dbus.dispatch(message);
    }));

    const bbus = new RemoteBus(abus);

    const cbus = new RemoteBus(createOptions(), new CallbackDispatcher((message: string) => {
      i++;
      return abus.dispatch(message);
    }));

    const dbus = new RemoteBus(cbus);

    const { writable, readable } = bbus.dispatch({});
    expect(i).to.equal(2);
  });

  it("defines the remote family type wen connected", async() => {

    const a = new EventEmitter();
    const b = new EventEmitter();

    let i = 0;

    const abus = new RemoteBus(createOptions("a", a, b), new CallbackDispatcher((message: string) => {
      i++;
      return bbus.dispatch(message);
    }));


    const bbus = new RemoteBus(createOptions("b", b, a), new CallbackDispatcher((message: string) => {
      i++;
      return bbus.dispatch(message);
    }));

    expect(bbus["_destFamily"]).to.equal("a");
  })
});