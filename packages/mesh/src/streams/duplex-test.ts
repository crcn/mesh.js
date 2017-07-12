import { expect } from "chai";
import { DuplexStream, WritableStream } from "..";

describe(__filename + "#", () => {
  it("waits for all chunks to be read before closing completely", async () => {
    const { readable, writable } = new DuplexStream((input, output) => {
      const writer = output.getWriter();
      writer.write("a");
      writer.write("b");
      writer.write("c");
      writer.close();
    });

    return new Promise((resolve, reject) => {  
      const chunks = [];
      readable.pipeTo(new WritableStream({
        write(chunk) {
          chunks.push(chunk);
        },
        close() {
          try {
            expect(chunks.join("")).to.equal("abc");
          } catch(e) { return reject(e) }
          resolve();
        }
      }))
    });
  });
});

