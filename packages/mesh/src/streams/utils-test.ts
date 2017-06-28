import { expect } from "chai";
import { tee, readAll } from "./utils";
// import "regenerator"

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
});