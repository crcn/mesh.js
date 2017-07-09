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

    const afn = remote<TestMessage>(options, (({ text }) => {
      return text.toUpperCase();
    }));

    const bfn = remote<TestMessage>(options);

    expect(await readAll(bfn({ text: "hello" }))).to.eql(["HELLO"]);
  });

  it("can send and receive a remote stream", async () => {

    const options = createOptions();

    const afn = remote(options, function*({ text }) {
      for (const char of text.split("")) {
        yield char;
      }
    });

    const bfn = remote(options);

    expect(await readAll(bfn({ text: "hello" }))).to.eql(["h", "e", "l", "l", "o"]);
  });

  it("can write chunks to a remote stream", async () => {
    const options = createOptions();

    const afn = remote(options, () => through((char: string) => char.toUpperCase()));

    const bfn = remote(options);

    expect(await readAll(pipe(["a", "b", "c", "d"], bfn({})))).to.eql(["A", "B", "C", "D"]);

  });

  it("doesn\'t get re-fned against the same remote function", async () => {
    let i = 0;
    const options = createOptions();
    const afn = remote(options, (message: string) => {
      i++;
      return afn(message);
    });

    const bfn = remote(options);
    const iter = await bfn({});
    await iter.next();
    await iter.next();
    await iter.next();
    expect(i).to.equal(1);
  });

  it("gets re-fned against other remote functions", async () => {
    let i = 0;
    const optionsA = createOptions();
    const afn = remote(optionsA, (message: string) => {
      i++;
      return dfn(message);
    });

    const bfn = remote(optionsA);

    const optionsB = createOptions();

    remote(optionsB, (message: string) => {
      i++;
      return afn(message);
    });

    const dfn = remote(optionsB);
    const iter = bfn({});
    await iter.next();

    expect(i).to.equal(2);
  });

  it("ends a fn that takes too long to respond", async () => {
    const options = createOptions({ timeout: 5 });
    type TestMessage = {
      timeout?: number
    };

    const afn = remote<TestMessage>(options, (message: TestMessage) => {
      return "a";
    });

    
    const bfn = remote<TestMessage>(options, (message: TestMessage) => {
      return "b";
    });

    const cfn = remote<TestMessage>(options, (message: TestMessage) => {
      // if (message.timeout) {
        // await timeout(message.timeout);
      // }
      return "c";
    });

    expect(await readAll(afn({ timeout: 0 }))).to.eql(["b", "c"]);
    
  });
});