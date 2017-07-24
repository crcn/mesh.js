import { expect } from "chai";
import { readOne } from "./read-one";

describe(__filename + "#", () => {
  it("can read one chunk from an async generator", async () => {
    const fn = async function*() {
      yield 1;
    };

    expect(await readOne(fn())).to.eql(1);
  });

  it("closes an async generator after readOne is called", async () => {
    let closed = false;
    const fn = function() {
      return {
        [Symbol.asyncIterator]: () => this,
        next() {
          return Promise.resolve({ value: 1, done: false });
        },
        return() {
          closed = true;
          return Promise.resolve();
        }
      }
    };

    expect(await readOne(fn())).to.eql(1);
    expect(closed).to.eql(true);
  });

  it("can keep an async generator open", async () => {
    let closed = false;
    const chunks = [1, 2, 3];
    const fn = function() {
      return {
        [Symbol.asyncIterator]: () => this,
        next() {
          return chunks.length ? Promise.resolve({ value: chunks.shift(), done: false }) : Promise.resolve({ done: true });
        },
        return() {
          closed = true;
          return Promise.resolve();
        }
      }
    };

    const gen = fn();

    expect(await readOne(gen, false)).to.eql(1);
    expect(closed).to.eql(false);
    expect(await readOne(gen, false)).to.eql(2);
    expect(closed).to.eql(false);
    expect(await readOne(gen, false)).to.eql(3);
  });
});