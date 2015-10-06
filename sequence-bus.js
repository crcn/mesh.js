import AsyncResponse from "./async-response";
import pipe			 from "./utils/pipe-stream";

/**
 */

function SequenceBus(busses) {
	this._busses = busses;
}

/**
 */

Object.assign(SequenceBus.prototype, {

	/**
	 */

	execute: function(operation) {
		return new AsyncResponse((writable) => {

			// copy incase the collection mutates (unlikely but possible)
			// TODO - test for this case before implementing
			var busses = this._busses;
			// var busses = this._busses.concat();

			var next = (i) => {
				if (i === busses.length) return writable.end();
				var resp = busses[i].execute(operation);
				pipe(busses[i].execute(operation), writable, { end: false }).then(() => next(i + 1));
			}

			next(0);

			var responses = this._busses.map((bus) => {
				return bus.execute(operation);
			});
		});
	}
});

/**
 */

module.exports = SequenceBus;
