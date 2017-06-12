import { expect } from "chai";
import { CallbackBus } from "./callback";
describe(__filename + "#", () => {
  it("can be created", () => {
    new CallbackBus((message) => {

    });
  });

  it("calls the callback when dispatched", () => {
    let i = 0;
    const bus = new CallbackBus(message => i++);
    bus.dispatch({});
    bus.dispatch({});
    expect(i).to.equal(2);
  });

  it("returns a value from the callback", async () => {
    let i = 0;
    const bus = new CallbackBus(message => i++);
    expect(await bus.dispatch({})).to.equal(0);
    expect(await bus.dispatch({})).to.equal(1);
    expect(await bus.dispatch({})).to.equal(2);
  });
});