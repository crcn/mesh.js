import { expect } from "chai";
import { NoopDispatcher } from "./noop";
describe(__filename + "#", () => {
  it("can be created", () => {
    new NoopDispatcher();
  });
  it("doesn't do anything when dispatch is called", () => {
    new NoopDispatcher().dispatch({});
  });
});