import { proxy } from ".";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can be created", () => {
    proxy();
  });
  it("resumes a proxy when getTarget returns a target", async () => {
    let i = 0;
    const fn = proxy(() => () => i++);
    await fn({}).next();
    expect(i).to.eql(1);
  });
  it("asynchronously waits for a proxy target", async () => {
    let i = 0;
    const fn = proxy(() => {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 20, ({a}) => a);
      });
    });
    expect(await fn({ a: "b" }).next()).to.eql({ value: "b", done: false });
  });

  it("the proxy target can be undefined", async () => {
    let i = 0;
    const fn = proxy(() => {
      return null;
    });
    expect(await fn({ a: "b" }).next()).to.eql({ value: undefined, done: true });
  });
});