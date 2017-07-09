import { expect } from "chai";
import { readAll, pipe, through, fallback } from "./index";

describe(__filename + "#", () => {
  it("can be created", () => {
    fallback();
  });
  it("can return values from the first dispatcher", async () => {
    const dispatch = fallback(
      m => "a"
    );
    
    expect(await readAll(dispatch({}))).to.eql(["a"]);
  });

  it("can return values from the second dispatcher if the first doesn't return anything", async () => {
    const dispatch = fallback(
      m => undefined,
      m => "b"
    );
    
    expect(await readAll(dispatch({}))).to.eql(["b"]);
  });

  it("can return all yields from the first dispatcher, and not the rest", async () => {
    const dispatch = fallback(
      function*() {
        yield "a";
        yield "b";
        yield "c";
      },
      m => "d"
    );
    
    expect(await readAll(dispatch({}))).to.eql(["a", "b", "c"]);
  });

  it("can take input data", async () => {
    const dispatch = fallback(
      m => through(a => -a),
      m => "d"
    );
    
    expect(await readAll(pipe([1, 2, 3], dispatch({})))).to.eql([-1, -2, -3]);
  });
});