import { expect } from "chai";
import { readAll, pipe, through } from "../utils";
import { createFallbackDispatcher } from "./fallback";

describe(__filename + "#", () => {
  it("can be created", () => {
    createFallbackDispatcher([]);
  });
  it("can return values from the first dispatcher", async () => {
    const dispatch = createFallbackDispatcher([
      m => "a"
    ]);
    
    expect(await readAll(dispatch({}))).to.eql(["a"]);
  });

  it("can return values from the second dispatcher if the first doesn't return anything", async () => {
    const dispatch = createFallbackDispatcher([
      m => undefined,
      m => "b"
    ]);
    
    expect(await readAll(dispatch({}))).to.eql(["b"]);
  });

  it("can return all yields from the first dispatcher, and not the rest", async () => {
    const dispatch = createFallbackDispatcher([
      function*() {
        yield "a";
        yield "b";
        yield "c";
      },
      m => "d"
    ]);
    
    expect(await readAll(dispatch({}))).to.eql(["a", "b", "c"]);
  });

  it("can take input data", async () => {
    const dispatch = createFallbackDispatcher([
      m => through(a => -a),
      m => "d"
    ]);
    
    expect(await readAll(pipe([1, 2, 3], dispatch({})))).to.eql([-1, -2, -3]);
  });
});