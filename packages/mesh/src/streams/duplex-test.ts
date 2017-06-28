import { expect } from "chai";
import { DuplexStream, WritableStream, createDuplexStream, readAll } from "..";

describe(__filename + "#", () => {
  xit("waits for all chunks to be read before closing completely", async () => {
    const [read, write] = createDuplexStream(async function(read, write) {
      write("a");
      write("b");
      write("c");
    });

    expect(await readAll(read)).to.eql(["a", "b", "c"]);
  });
});

