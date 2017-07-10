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

  it("can send and receive a remote message", async () => {

    const options = createOptions();

    const afn = remote(() => options, (({ text }) => {
      return text.toUpperCase();
    }));

    const bfn = remote(() => options);

    expect(await readAll(bfn({ text: "hello" }))).to.eql(["HELLO"]);
  });

  it("can send and receive a remote stream", async () => {

    const options = createOptions();

    const afn = remote(() => options, function*({ text }) {
      for (const char of text.split("")) {
        yield char;
      }
    });

    const bfn = remote(() => options);

    expect(await readAll(bfn({ text: "hello" }))).to.eql(["h", "e", "l", "l", "o"]);
  });

  it("can write chunks to a remote stream", async () => {
    const options = createOptions();

    const afn = remote(() => options, () => through((char: string) => char.toUpperCase()));

    const bfn = remote(() => options);

    expect(await readAll(pipe(["a", "b", "c", "d"], bfn({})))).to.eql(["A", "B", "C", "D"]);

  });

  it("doesn\'t get re-fned against the same remote function", async () => {
    let i = 0;
    const options = createOptions();
    const afn = remote(() => options, (message: string) => {
      i++;
      return afn(message);
    });

    const bfn = remote(() => options);
    const iter = await bfn({});
    await iter.next();
    await iter.next();
    await iter.next();
    expect(i).to.equal(1);
  });

  it("gets re-fned against other remote functions", async () => {
    let i = 0;
    const optionsA = createOptions();
    const afn = remote(() => optionsA, (message: string) => {
      i++;
      return dfn(message);
    });

    const bfn = remote(() => optionsA);

    const optionsB = createOptions();

    remote(() => optionsB, (message: string) => {
      i++;
      return afn(message);
    });

    const dfn = remote(() => optionsB);
    const iter = bfn({});
    await iter.next();

    expect(i).to.equal(2);
  });

  it("ends a fn that takes too long to respond", async () => {
    const options = createOptions({ timeout: 5 });
    type TestMessage = {
      timeout?: number
    };

    const afn = remote(() => options, () => "a");
    const bfn = remote(() => options, () => "b");
    const cfn = remote(() => options, () => "c");

    expect(await readAll(afn({ timeout: 0 }))).to.eql(["b", "c"]);
  });

  it("can pass multiple arguments to remote functions", async () => {
    const options = createOptions({ timeout: 5 });
    type TestMessage = {
      timeout?: number
    };

    const add = remote(() => options, (a, b) => a + b);
    const remoteAdd = remote(() => options);

    expect(await readAll(remoteAdd(1, 2))).to.eql([3]);
  });

  it("ends a remote call if the caller returns the iterator", async () => {
    const options = createOptions({ timeout: 5 });
    type TestMessage = {
      timeout?: number
    };

    const repeat = remote(() => options, function*({ n }) {
      for (let i = n; i--;) {
        yield i;
      }
    });

    const remoteRepeat = remote(() => options);
    expect(await readAll(remoteRepeat({ n: 4 }))).to.eql([3, 2, 1, 0]);

    const iter = remoteRepeat({ n: 3 });
    expect(await iter.next()).to.eql({ value: 2, done: false });
    await iter.return();
    expect(await iter.next()).to.eql({ done: true });
  });
});