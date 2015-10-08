import pump from "./pump-stream";

/**
 * pumps a stream into another stream
 */

export default function(readable, writable, ops) {

	if (!ops) {
		ops = {
			end: true
		}
	}

	return new Promise(function(resolve, reject) {
    pump(readable, (chunk) => {
      if (!chunk.done) {
        writable.write(chunk.value);
      } else {
        if (ops.end) writable.end();
        resolve();
      }
    }, writable.error.bind(writable));
	});
};
