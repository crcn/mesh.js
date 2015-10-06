import { AsyncResponse } from "..";
import co from "co";
import expect from "expect.js";

describe(__filename + "#", function() {

	it("read() chunks immediately if they exist", co.wrap(function*() {
		var response = new AsyncResponse();

		response.write("a");
		response.write("b");
		response.end();

		var ret = co(function*() {
			expect(yield response.read()).to.be("a");
			expect(yield response.read()).to.be("b");
			expect(yield response.read()).to.be(void 0);
		});


		yield ret;
	}));

	it("read() waits until write() data exists", co.wrap(function*() {
		var response = new AsyncResponse();

		var ret = co(function*() {
			expect(yield response.read()).to.be("a");
			expect(yield response.read()).to.be("b");
			expect(yield response.read()).to.be(void 0);
		});

		response.write("a");
		response.write("b");
		response.end();

		yield ret;
	}));

	it("can end() with a chunk", co.wrap(function*() {
		var response = new AsyncResponse();

		var ret = co(function*() {
			expect(yield response.read()).to.be("a");
			expect(yield response.read()).to.be("b");
			expect(yield response.read()).to.be(void 0);
		});

		response.write("a");
		response.end("b");

		yield ret;
	}));
});
