import { through } from "./index";
import { expect } from "chai";

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

    it("finishes if there are no more inputs", async () => {

      const iter = through(function*(amount: number) {
        for (let i = amount; i--;) {
          yield i;
        }
      });

      expect((await iter.next(3)).value).to.eql(2);
      expect((await iter.next()).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
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
      expect((await iter.next()).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
      expect((await iter.next()).value).to.eql(2);
      expect((await iter.next()).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
      expect((await iter.next()).done).to.eql(true);
    });

    it("can keep open", async () => {

      const iter = through(function*(amount: number) {
        for (let i = amount; i--;) {
          yield i;
        }
      }, true);

      expect((await iter.next(2)).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
      const p  = iter.next();
      const p2 = iter.next(3);
      expect((await p).value).to.eq(2);
      expect((await p2).value).to.eql(1);
      expect((await iter.next()).value).to.eql(0);
    });
  });