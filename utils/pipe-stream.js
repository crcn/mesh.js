
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
		function pump() {
			readable.read().then(function(chunk) {
				if (!chunk.done) {
					writable.write(chunk.value);
					pump();
				} else {
					if (ops.end) writable.end();
					resolve();
				}
			}, writable.error.bind(writable));
		}
		pump();
	});
};
