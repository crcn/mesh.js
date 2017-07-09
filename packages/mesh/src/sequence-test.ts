import { expect } from "chai";
import { timeout } from "./test";
import { sequence, pipe, readAll, through } from ".";

describe(__filename + "#", () => {
  it("can dispatch a message to multiple endpoints in sequence", async () => {
    let i = 0;

    const dispatch = sequence(
      m => i++,
      m => i++,
      m => i++
    );

    const iterable = dispatch({});
    expect((await iterable.next()).value).to.eql(0);
    expect((await iterable.next()).value).to.eql(1);
    expect((await iterable.next()).value).to.eql(2);
  });
  
  it("can yield all values from targets", async () => {
    let i = 0;

    const dispatch = sequence(
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

    const iterable = dispatch({});
    expect((await iterable.next()).value).to.eql("a");
    expect((await iterable.next()).value).to.eql("b");
    expect((await iterable.next()).value).to.eql("c");
    expect((await iterable.next()).value).to.eql("d");
    expect((await iterable.next()).value).to.eql("e");
    expect((await iterable.next()).value).to.eql("f");
    expect((await iterable.next()).done).to.eql(true);
  });

  it("ignores returned values from target dispatchers", async () => {
    const dispatch = sequence(
      function *(m) {
        yield "a";
        yield "b";
        return "c";
      }
    );
    const iterable = dispatch({});
    expect((await iterable.next()).value).to.eql("a");
    expect((await iterable.next()).value).to.eql("b");
    expect((await iterable.next()).value).to.eql(undefined);
  });

  it("can write data to all dispatchers", async () => {
    const dispatch = sequence(
      m => through((chunk: string) => chunk.toUpperCase()),
      m => through((chunk: string) => `${chunk}!`)
    );

    const iterable = dispatch({});
    expect((await iterable.next("a")).value).to.eql("A");
    expect((await iterable.next()).value).to.eql("a!");
    expect((await iterable.next()).done).to.eql(true);
  });

  it("can write data to all dispatchers", async () => {
    const dispatch = sequence(
      m => through((chunk: string) => chunk.toUpperCase()),
      m => through((chunk: string) => `${chunk}!`)
    );

    const iterable = dispatch({});
    expect((await iterable.next("a")).value).to.eql("A");
    expect((await iterable.next()).value).to.eql("a!");
    expect((await iterable.next()).done).to.eql(true);
  });

  it("can pipe input and receive output", async () => {
    const dispatch = sequence(
      m => through((v: number) => -v)
    );

    expect(await readAll(pipe([1, 2, 3], dispatch({})))).to.eql([-1, -2, -3]);
  });

  it("can nest sequence dispatchers", async () => {
    let i = '';
    const dispatch = sequence(
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

    const stream = dispatch({});
    expect((await stream.next()).value).to.eql('a');
    expect((await stream.next()).value).to.eql('ab');
    expect((await stream.next()).value).to.eql('abc');
    expect((await stream.next()).value).to.eql('abcd');
    expect((await stream.next()).value).to.eql('abcde');
    expect((await stream.next()).value).to.eql('abcdef');
    expect((await stream.next()).value).to.eql('abcdefg');
    expect((await stream.next()).done).to.eql(true);
  });
});