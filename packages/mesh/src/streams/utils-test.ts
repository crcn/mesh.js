import { expect } from "chai";
import { pipe, through, tee, readAll } from "./utils";

(Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol("Symbol.asyncIterator");

describe(__filename + "#", () => {
  describe("tee#", () => {
    it("can tee an iterable", async function() {
      let callCount = 0;
      const read = tee(async function*() {
        callCount++;
        yield 1;
        yield 2;
        yield 3;
      });

      const a = read();
      const b = read();

      expect((await a.next()).value).to.eql(1);
      expect((await b.next()).value).to.eql(1);
      expect((await b.next()).value).to.eql(2);
      expect((await a.next()).value).to.eql(2);
    });
  }); 

  describe("through#", () => {
    it("can be used with a vanilla adder function", async () => {

      const iter = through((value: number) => value + 1);
      expect((await iter.next(1)).value).to.eql(2);
      expect((await iter.next(2)).value).to.eql(3);
    });

    it("yields all results from target function to iterator", async () => {

      const iter = through(function*(amount: number) {
        for (let i = amount; i--;) {
          yield i;
        }
      });

      expect((await iter.next(5)).value).to.eql(4);
      expect((await iter.next()).value).to.eql(3);
      expect((await iter.next()).value).to.eql(2);
      expect((await iter.next()).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
    });

    it("calls the through function if no argument is given", async () => {

      const iter = through(function*(amount: number = 2) {
        for (let i = amount; i--;) {
          yield i;
        }
      });

      expect((await iter.next()).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
    });

    it("never finishes by default", async () => {

      const iter = through(function*(amount: number = 2) {
        for (let i = amount; i--;) {
          yield i;
        }
      });

      expect((await iter.next()).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
      expect((await iter.next()).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
      expect((await iter.next()).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
      expect((await iter.next()).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
      expect((await iter.next()).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
    });

    it("finishes the iterable if maxCalls is 1", async () => {

      const iter = through(function*(amount: number = 2) {
        for (let i = amount; i--;) {
          yield i;
        }
      }, 1);

      expect((await iter.next()).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
      expect((await iter.next()).done).to.eql(true);
      expect((await iter.next()).done).to.eql(true);
      expect((await iter.next()).done).to.eql(true);
      expect((await iter.next()).done).to.eql(true);
    });

    it("finishes yielding the current through iterator before running the next", async () => {

      const iter = through(function*(amount: number) {
        for (let i = amount; i--;) {
          yield i;
        }
      });

      expect((await iter.next(4)).value).to.eql(3);
      expect((await iter.next(3)).value).to.eql(2);
      expect((await iter.next(2)).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
      expect((await iter.next()).value).to.eql(2);
      expect((await iter.next()).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
      expect((await iter.next()).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
    });
  });

  describe("pipe#", () => {
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
    });
    
    it("can pipe with multiple throughs", async function() {
      const pipeline = pipe(
        through((v: string) => String(v).toUpperCase()),
        through((v: string) => `${v}!`),
        through((v: string) => `${v}!!??`)
      );
      expect((await pipeline.next("one")).value).to.eq("ONE!!!??");
      expect((await pipeline.next("five")).value).to.eq("FIVE!!!??");
    });
  });
});