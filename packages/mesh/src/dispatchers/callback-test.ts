import { expect } from "chai";
import { createCallbackDispatcher } from "./callback";
describe(__filename + "#", () => {
  it("can be created", () => {
    createCallbackDispatcher(a => 1);
  });

  it("calls the callback when dispatched", () => {
    let i = 0;
    const dispatch = createCallbackDispatcher(message => i++);
    dispatch({});
    dispatch({});
    expect(i).to.equal(2);
  });

  it("returns a value from the callback", async () => {
    let i = 0;
    const dispatch = createCallbackDispatcher(message => i++);
    expect(await dispatch({})).to.equal(0);
    expect(await dispatch({})).to.equal(1);
    expect(await dispatch({})).to.equal(2);
  });
});