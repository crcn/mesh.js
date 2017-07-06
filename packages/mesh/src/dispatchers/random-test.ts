import { createRandomDispatcher } from "..";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can be created", () => {
    createRandomDispatcher([]);
  });

  it("can dispatch randomly against different targets", async () => {
    const dispatch = createRandomDispatcher([
      m => 1,
      m => 2,
      m => 3,
    ]);
    
    const counts = {1: 0, 2: 0, 3: 0} as any;
    for (let i = 1000; i--;) {
      counts[(await dispatch({}).next()).value as number]++;
    }

    expect(counts[1] !== counts[2] !== counts[3]).to.eql(true);
    expect(counts[1] > 0).to.eql(true);
    expect(counts[2] > 0).to.eql(true);
    expect(counts[3] > 0).to.eql(true);
  });

  it("can add a 0 weight to a target", async () => {
    const dispatch = createRandomDispatcher([
      m => 1,
      m => 2,
      m => 3,
    ], [3, 1, 0]);
    
    const counts = {1: 0, 2: 0, 3: 0} as any;
    for (let i = 1000; i--;) {
      counts[(await dispatch({}).next()).value as number]++;
    }
    expect(counts[3]).to.eql(0);
  });

  it("can add more weight to one target", async () => {
    const dispatch = createRandomDispatcher([
      m => 1,
      m => 2,
      m => 3,
    ], [5, 1, 1]);
    
    const counts = {1: 0, 2: 0, 3: 0} as any;
    const n = 2000;
    for (let i = n; i--;) {
      counts[(await dispatch({}).next()).value as number]++;
    }
    expect(counts[1] > 0.6).to.eql(true);
  });
});

