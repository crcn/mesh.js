
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
				if (chunk != void 0) {
					writable.write(chunk);
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
