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

	it("runs the provided callback function in the constructor", co.wrap(function*() {
		var response = new AsyncResponse(function(response) {
			response.write("a");
			response.end("b");
		});

		expect(yield response.read()).to.be("a");
		expect(yield response.read()).to.be("b");
		expect(yield response.read()).to.be(void 0);
	}));

	it("can continue to read after the response has ended", co.wrap(function*() {
		var response = new AsyncResponse(function(response) {
			response.end();
		});
		yield response.read();
		yield response.read();
		yield response.read();
		yield response.read();
	}));
});
