import { inlet, outlet } from "./channel";
import { expect } from "chai";
import { createQueue } from "./queue";
import { noop } from "lodash";
import { readOne } from "./read-one";
import { readAll } from "./read-all";
import { pump } from "./pump";
import { createDuplex } from "./duplex";

describe(__filename + "#", () => {
  it("can pass values through an open channel", async () => {
    const call = (a) => {
      return outlet(() => (b) => {
        return a + b;
      });
    };

    const c = inlet(call(5), noop);
    expect(await c(6).next()).to.eql({ value: 11, done: false });
  });

  it("can yield multiple values through a channel", async () => {
    const call = (a) => {
      return outlet(() => async function*(b) {
        yield* [a + b + 1, a + b + 2, a + b + 3];
      });
    };

    const iter = call(5);
    const c = inlet(iter, noop);

    expect(await readAll(c(6))).to.eql([12, 13, 14]);
  });

  it("can nest a channel within a channel", async () => {
    const call = (a) => {
      return outlet(() => function(b) {
        return outlet(() => function(c) {
          return a + b + c;
        })
      });
    };

    const iter = call(5);
    const c  = inlet(call(5), noop);
    const c2 = inlet(c(6), noop);
    expect(await c2(7).next()).to.eql({ value: 18, done: false });
  });

  it("can nest a channel within a channel within a channel", async () => {
    const call = (a) => {
      return outlet(() => function(b) {
        return outlet(() => function(c) {
          return outlet(() => function(d) {
            return a + b + c + d;
          });
        });
      });
    };

    const iter = call(5);
    const c  = inlet(call(5), noop);
    const c2 = inlet(c(6), noop);
    const c3 = inlet(c2(7), noop);
    expect(await c3(8).next()).to.eql({ value: 26, done: false });
  });

  it("can call the outer target function from an inner", async () => {
    const call = (a) => {
      return outlet((upstream) => async (b) => {
        return await readOne(upstream(a + b));
      });
    };
    const c = inlet(call(5), (v) => v * 2);
    expect(await readOne(c(7))).to.eql(24);
  });


  it("can call the outer target function from an nested inner", async () => {
    const call = (a) => {
      return outlet((u1) => (b) => outlet((u2) => async (c) => {
        return await readOne(u1(await readOne(u2(a + b + c))));
      }));
    };
    const c = inlet(call(5), (v) => v * 2);
    const c2 = inlet(c(5), (v) => v * 3);
    expect(await readOne(c2(7))).to.eql(102);
  });
});