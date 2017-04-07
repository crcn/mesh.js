import { expect } from "chai";
import { CallbackDispatcher } from "./callback";
describe(__filename + "#", () => {
  it("can be created", () => {
    new CallbackDispatcher((message) => {

    });
  });

  it("calls the callback when dispatched", () => {
    let i = 0;
    const dispatcher = new CallbackDispatcher(message => i++);
    dispatcher.dispatch({});
    dispatcher.dispatch({});
    expect(i).to.equal(2);
  });

  it("returns a value from the callback", async () => {
    let i = 0;
    const dispatcher = new CallbackDispatcher(message => i++);
    expect(await dispatcher.dispatch({})).to.equal(0);
    expect(await dispatcher.dispatch({})).to.equal(1);
    expect(await dispatcher.dispatch({})).to.equal(2);
  });
});