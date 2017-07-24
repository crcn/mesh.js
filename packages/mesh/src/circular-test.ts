import { noop } from "lodash";
import { expect } from "chai";
import { readAll } from "./read-all";
import { readOne } from "./read-one";
import { circular } from "./circular";

describe(__filename + "#", () => {
  it("can be created & called", async () => {
    const add = circular((up) => () => (a: number, b: number) => a + b)(noop);
    expect(await readOne(add(1, 2))).to.eql(3);
  });

  it("can create a circular async generator that can call itself", async () => {
    const incTo = circular((upstream) => (downstream) => async function*(n: number) {
      if (!n) return yield 0;
      yield* [n].concat(await readAll(upstream(n - 1)) as number[]);
    })(noop);
    

    expect(await readAll(incTo(5))).to.eql([5, 4, 3, 2, 1, 0]);
  });
});
