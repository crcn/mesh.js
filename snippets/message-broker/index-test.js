var broker = require("./index");
var mesh   = require("mesh");
var expect = require("expect.js");

describe(__filename + "#", function() {

  var workers = [];
  var weights = [];


  beforeEach(function() {

    workers = Array.apply(void 0, new Array(10)).map(function(v, i) {

      var bus = mesh.wrap(function(operation, next) {
        bus.operations.push(operation);

        if (!operation.delay) return next.apply(void 0, operation.yields || []);
        setTimeout.apply(global, [next, (i + 1) * 2].concat(operation.yields || []));
      });

      bus.operations = [];
      return bus;
    });

    weights = Array.apply(void 0, new Array(workers.length)).map(function(v) { return 1; });
  });

  describe("round robin#", function() {

    it("can do a simple round robin", function(next) {
      var bus = mesh.limit(1, broker(workers));
      for (var i = 2; i--;) bus({ dist: "roundRobin" });
      bus({ dist: "roundRobin" }).on("end", function() {
        expect(workers[0].operations.length).to.be(1);
        expect(workers[0].operations.length).to.be(1);
        expect(workers[0].operations.length).to.be(1);
        next();
      });
    });

    it("can do a weighted round robin", function(next) {

      weights[3] = 3;

      var bus = mesh.limit(1, broker(workers, weights));
      for (var i = 3; i--;) bus({ dist: "roundRobin" });
      bus({ dist: "roundRobin" }).on("end", function() {
        expect(workers[3].operations.length).to.be(3);
        next();
      });
    });
  });

  describe("random#", function() {

    it("can run", function(next) {
      var bus = mesh.limit(1, broker(workers));
      for (var i = 10; i--;) bus({ dist: "random" });
      bus({ dist: "random" }).on("end", function() {
        expect(workers.filter(function(worker) {
          return worker.operations.length > 0;
        }).length).to.be.greaterThan(1);
        next();
      });
    });

    it("can do a weighted random", function(next) {

      weights = Array.apply(void 0, new Array(workers.length)).map(function(v) { return 0; });

      weights[3] = 10;

      var bus = mesh.limit(1, broker(workers, weights));
      bus({ dist: "random" });
      bus({ dist: "random" }).on("end", function() {
        expect(workers[3].operations.length).to.be(2);
        next();
      });
    });
  });

  describe("least#", function() {

    it("picks the busses with the least connections", function(next) {
      var bus = mesh.limit(2, broker(workers));
      for (var i = 10; i--;) bus({ dist: "least" });
      bus({ dist: "least" }).on("end", function() {
        expect(workers[0].operations.length).to.be(6);
        expect(workers[1].operations.length).to.be(5);
        expect(workers[2].operations.length).to.be(0);
        next();
      });
    });

    it("can do a weighted least connection", function(next) {

      weights[4] = 2;

      var bus = mesh.limit(3, broker(workers, weights));
      for (var i = 10; i--;) bus({ dist: "least" });
      bus({ dist: "least" }).on("end", function() {
        expect(workers[0].operations.length).to.be(4);
        expect(workers[1].operations.length).to.be(3);
        expect(workers[4].operations.length).to.be(4);
        next();
      });
    });
  });

  describe("fastest#", function() {
    xit("can pick the fastest bus", function(next) {
      var bus = broker(workers, weights);
      for (var i = 10; i--;) bus({ delay: true, dist: "fastest" });
      bus({ delay: true, dist: "fastest" }).on("end", function() {
        console.log("END");
        next();
      });
    });
  });
});
