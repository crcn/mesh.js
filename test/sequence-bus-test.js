import { SequenceBus, AsyncResponse } from "..";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {

	function YieldsBus(error, result) {
		this.execute = function(operation) {
			return new AsyncResponse(function(writable) {
				if (error) return writable.reject(error);
				writable.end(result);
			});
		}
	}

	it("executes ops against multiple busses and joins the read() data", co.wrap(function*() {

		var bus = new SequenceBus([
			new YieldsBus(void 0, "a"),
			new YieldsBus(void 0, "b")
		]);

		var response = bus.execute();

		expect(yield response.read()).to.be("a");
		expect(yield response.read()).to.be("b");
		expect(yield response.read()).to.be(void 0);
	}));

	xit("passes errors down");
});
