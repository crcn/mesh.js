import { expect } from "chai";
import { timeout } from "./test";
import { EventEmitter } from "events";
import { remote, readAll, pipe, through } from ".";

describe(__filename + "#", () => {

  const createOptions = ({ timeout = 100 }: { timeout?: number } = {}, input?: EventEmitter, output?: EventEmitter) => {
    if (!input || !output) {
      input = output = new EventEmitter();
    }
    return {
      timeout: timeout,
      adapter: {
        addListener : input.on.bind(input, "message"),
        send        : input.emit.bind(input, "message")
      }
    }
  }

  interface TestMessage {
    text: string;
  }

  it("can send and receive a remote message", async () => {

    const options = createOptions();

    const adispatch = remote<TestMessage>(options, (({ text }) => {
      return text.toUpperCase();
    }));

    const bdispatch = remote<TestMessage>(options);

    expect(await readAll(bdispatch({ text: "hello" }))).to.eql(["HELLO"]);
  });

  it("can send and receive a remote stream", async () => {

    const options = createOptions();

    const adispatch = remote(options, function*({ text }) {
      for (const char of text.split("")) {
        yield char;
      }
    });

    const bdispatch = remote(options);

    expect(await readAll(bdispatch({ text: "hello" }))).to.eql(["h", "e", "l", "l", "o"]);
  });

  it("can write chunks to a remote stream", async () => {
    const options = createOptions();

    const adispatch = remote(options, () => through((char: string) => char.toUpperCase()));

    const bdispatch = remote(options);

    expect(await readAll(pipe(["a", "b", "c", "d"], bdispatch({})))).to.eql(["A", "B", "C", "D"]);

  });

  it("doesn\'t get re-dispatched against the same remote dispatcher", async () => {
    let i = 0;
    const options = createOptions();
    const adispatch = remote(options, (message: string) => {
      i++;
      return adispatch(message);
    });

    const bdispatch = remote(options);
    const iter = await bdispatch({});
    await iter.next();
    await iter.next();
    await iter.next();
    expect(i).to.equal(1);
  });

  it("gets re-dispatched against other remote dispatchers", async () => {
    let i = 0;
    const optionsA = createOptions();
    const adispatch = remote(optionsA, (message: string) => {
      i++;
      return ddispatch(message);
    });

    const bdispatch = remote(optionsA);

    const optionsB = createOptions();

    remote(optionsB, (message: string) => {
      i++;
      return adispatch(message);
    });

    const ddispatch = remote(optionsB);
    const iter = bdispatch({});
    await iter.next();

    expect(i).to.equal(2);
  });

  it("ends a dispatch that takes too long to respond", async () => {
    const options = createOptions({ timeout: 5 });
    type TestMessage = {
      timeout?: number
    };

    const adispatch = remote<TestMessage>(options, (message: TestMessage) => {
      return "a";
    });

    
    const bdispatch = remote<TestMessage>(options, (message: TestMessage) => {
      return "b";
    });

    const cdispatch = remote<TestMessage>(options, (message: TestMessage) => {
      // if (message.timeout) {
        // await timeout(message.timeout);
      // }
      return "c";
    });

    expect(await readAll(adispatch({ timeout: 0 }))).to.eql(["b", "c"]);
    
  });
});