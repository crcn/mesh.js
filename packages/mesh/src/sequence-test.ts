import { expect } from "chai";
import { timeout } from "./test";
import { sequence, pipe, readAll, through } from ".";

describe(__filename + "#", () => {
  it("can call a message to multiple endpoints in sequence", async () => {
    let i = 0;

    const fn = sequence(
      m => i++,
      m => i++,
      m => i++
    );

    const iterable = fn({});
    expect((await iterable.next()).value).to.eql(0);
    expect((await iterable.next()).value).to.eql(1);
    expect((await iterable.next()).value).to.eql(2);
  });
  
  it("can yield all values from targets", async () => {
    let i = 0;

    const fn = sequence(
      function *(m) {
        yield "a";
        yield "b";
      },
      function*(m) {
        yield "c";
        yield "d";
      },
      function*(m) {
        yield "e";
        yield "f";
      }
    );

    const iterable = fn({});
    expect((await iterable.next()).value).to.eql("a");
    expect((await iterable.next()).value).to.eql("b");
    expect((await iterable.next()).value).to.eql("c");
    expect((await iterable.next()).value).to.eql("d");
    expect((await iterable.next()).value).to.eql("e");
    expect((await iterable.next()).value).to.eql("f");
    expect((await iterable.next()).done).to.eql(true);
  });

  it("ignores returned values from target functions", async () => {
    const fn = sequence(
      function *(m) {
        yield "a";
        yield "b";
        return "c";
      }
    );
    const iterable = fn({});
    expect((await iterable.next()).value).to.eql("a");
    expect((await iterable.next()).value).to.eql("b");
    expect((await iterable.next()).value).to.eql(undefined);
  });

  it("can write data to all functions", async () => {
    const fn = sequence(
      m => through((chunk: string) => chunk.toUpperCase()),
      m => through((chunk: string) => `${chunk}!`)
    );

    const iterable = fn({});
    expect((await iterable.next("a")).value).to.eql("A");
    expect((await iterable.next()).value).to.eql("a!");
    expect((await iterable.next()).done).to.eql(true);
  });

  it("can write data to all functions", async () => {
    const fn = sequence(
      m => through((chunk: string) => chunk.toUpperCase()),
      m => through((chunk: string) => `${chunk}!`)
    );

    const iterable = fn({});
    expect((await iterable.next("a")).value).to.eql("A");
    expect((await iterable.next()).value).to.eql("a!");
    expect((await iterable.next()).done).to.eql(true);
  });

  it("can pipe input and receive output", async () => {
    const fn = sequence(
      m => through((v: number) => -v)
    );

    expect(await readAll(pipe([1, 2, 3], fn({})))).to.eql([-1, -2, -3]);
  });

  it("can nest sequence functions", async () => {
    let i = '';
    const fn = sequence(
      sequence(
        m => i += 'a',
        m => i += 'b',
        m => i += 'c'
      ),
      sequence(
        m => i += 'd',
        m => i += 'e',
        m => i += 'f'
      ),
      m => i += 'g'
    );

    const stream = fn({});
    expect((await stream.next()).value).to.eql('a');
    expect((await stream.next()).value).to.eql('ab');
    expect((await stream.next()).value).to.eql('abc');
    expect((await stream.next()).value).to.eql('abcd');
    expect((await stream.next()).value).to.eql('abcde');
    expect((await stream.next()).value).to.eql('abcdef');
    expect((await stream.next()).value).to.eql('abcdefg');
    expect((await stream.next()).done).to.eql(true);
  });

  it("throws an error if a target emits one", async () => {
    let i = '';
    const fn = sequence(
      m => { throw new Error("some error") }
    );

    const iter = fn({});
    let err: Error;
    try {
      await iter.next();
    } catch(e) {
      err = e;
    }

    expect(err.message).to.eql("some error");
  });
});