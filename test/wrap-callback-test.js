var mesh = require("../");
var expect  = require("expect.js");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can run operations", function(next) {

    var db = mesh.wrapCallback(function(operation, next) {
      next(void 0, "a");
    });

    db(mesh.op("insert")).on("data", function() {
      next();
    });
  });

  it("can handle errors", function(next) {

    var db = mesh.wrapCallback(function(operation, next) {
      next(new Error("a"));
    });

    db(mesh.op("insert")).on("error", function() {
      next();
    });
  });
});
