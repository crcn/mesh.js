import { pipe, through, readAll } from "./index";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can use a pipeline with just one iterator", async function() {
    const pipeline = pipe(
      (async function*() {
        let i = 0;
        while(true) {
          i = yield i + 1;
        }
      })()
    );

    expect((await pipeline.next(1)).value).to.eql(1);
    expect((await pipeline.next(2)).value).to.eql(3);
    expect((await pipeline.next(3)).value).to.eql(4);
    expect((await pipeline.next(4)).value).to.eql(5);
  });

  it("can pipe with a through call", async function() {
    const pipeline = pipe(
      through((v: number) => v + 1)
    );
    expect((await pipeline.next(1)).value).to.eq(2);
    expect((await pipeline.next(5)).value).to.eq(6);
    expect((await pipeline.next()).done).to.eq(true);
  });
  
  it("can pipe with multiple throughs", async function() {
    const pipeline = pipe(
      through((v: string) => String(v).toUpperCase()),
      through((v: string) => `${v}!`),
      through((v: string) => `${v}!!??`)
    );
    expect((await pipeline.next("one")).value).to.eq("ONE!!!??");
    expect((await pipeline.next("five")).value).to.eq("FIVE!!!??");
    expect((await pipeline.next()).done).to.eq(true);
  });

  it("can use an array as an argument", async function() {
    const pipeline = pipe(
      [1, 2, 3, 4],
      through((v: number) => -v)
    );
    
    expect((await pipeline.next()).value).to.eq(-1);
    expect((await pipeline.next()).value).to.eq(-2);
    expect((await pipeline.next()).value).to.eq(-3);
    expect((await pipeline.next()).value).to.eq(-4);
    expect((await pipeline.next()).done).to.eq(true);
  });

  it("can be used in conjuction with readAll", async function() {
    expect(await readAll(pipe([1, 2, 3], through(v => -v)))).to.eql([-1, -2, -3]);
  });

  it("calls return on all async iterables after the pipeline as finished", async function() {
    let _returned = 0;
    const pipeline = pipe(
      [1, 2, 3],
      {
        [Symbol.asyncIterator]: () => this,
        next: (v) => Promise.resolve({ value: v + 1, done: false }),
        return() {
          _returned++;
        }
      },
      {
        [Symbol.asyncIterator]: () => this,
        next: (v) => Promise.resolve({ value: -v, done: false }),
        return() {
          _returned++;
        }
      }
    );

    expect(await readAll(pipeline)).to.eql([-2, -3, -4]);
    expect(_returned).to.eql(2);
  });
});