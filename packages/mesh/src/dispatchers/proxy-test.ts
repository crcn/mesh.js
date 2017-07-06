import { createProxyDispatcher } from "..";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can be created", () => {
    createProxyDispatcher();
  });
  it("resumes a proxy when getTarget returns a target", async () => {
    let i = 0;
    const dispatch = createProxyDispatcher(() => () => i++);
    await dispatch({}).next();
    expect(i).to.eql(1);
  });
  it("asynchronously waits for a proxy target", async () => {
    let i = 0;
    const dispatch = createProxyDispatcher(() => {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 20, ({a}) => a);
      });
    });
    expect(await dispatch({ a: "b" }).next()).to.eql({ value: "b", done: false });
  });
});