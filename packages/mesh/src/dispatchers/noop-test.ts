import { expect } from "chai";
// import { NoopBus } from "./noop";
describe(__filename + "#", () => {
  it("can be created", () => {
    new NoopBus();
  });
  it("doesn't do anything when dispatch is called", () => {
    new NoopBus().dispatch({});
  });
});