var mesh = require("../");
var expect  = require("expect.js");
var through = require("through2");
var _       = require("highland");

describe(__filename + "#", function() {
  it("can be run", function(next) {

    var i = 0;
    var j = 0;

    var startTime = Date.now();

    var db1 = function(name, properties) {
      i++;
      expect(Date.now() - startTime).to.be.lessThan(5);
      return _([{ name: "a"}, { name: "a"}, { name: "a" }]).pipe(through.obj(function(data, enc, next) {
        this.push(data);
        setTimeout(next, 3);
      }));
    };

    var db2 = function() {
      i++;
      expect(Date.now() - startTime).to.be.lessThan(5);
      return _([{ name: "a"}, { name: "a"}, { name: "a" }]).pipe(through.obj(function(data, enc, next) {
        this.push(data);
        setTimeout(next, 3);
      }));
    };

    var db3 = mesh.parallel(db1, db2);
    db3("insert").on("data", function() {
      j++;
    }).on("end", function() {
      expect(i).to.be(2);
      expect(j).to.be(6);
      next();
    });
  });

  it("can run without any args", function(next) {
    var bus = mesh.parallel();
    bus(mesh.op("insert")).on("end", next);
  });

  it("can handle an error", function(next) {

    var busA = mesh.yields(new Error("done"));
    var busB = mesh.yields(void 0, 1);

    var bus = mesh.parallel(busA, busB);
    var i = 0;
    var j = 0;
    bus(mesh.op("done")).on("error", function() {
      j++;
    }).on("end", function() {
      i++;
    });

    setTimeout(function() {
      expect(i).to.be(0);
      expect(j).to.be(1);
      next();
    }, 10);
  });
});
