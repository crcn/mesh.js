import { when } from "./when";
import { readAll } from ".";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can be created", () => {
    when(() => false);
  });
  it("can redirect messages based on the tester", async () => {
    const fn = when(({pass}) => pass, () => "a", () => "b");
    expect(await readAll(fn({}))).to.eql(["b"]);
    expect(await readAll(fn({ pass: true }))).to.eql(["a"]);
  });
});