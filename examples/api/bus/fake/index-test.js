var fake    = require("./index");
var expect  = require("expect.js");
var mesh    = require("../../../..");
var fixtures = require("../../fixtures");

describe(__filename + "#", function() {

  var bus;
  var requestOptions;

  beforeEach(function() {
    bus = fake({
      fixtures: fixtures
    });
  });

  it("can load fixture data based on the query ", function(next) {
    bus({ fake: true, name: "load", collection: "users", query: { id: "user-1" }}).on("data", function(data) {
      expect(data.id).to.be("user-1");
      next();
    });
  });

  it("can load fixture data based on the query ", function(next) {
    bus({ fake: true, name: "load", collection: "users", query: { id: "user-1" }}).on("data", function(data) {
      expect(data.id).to.be("user-1");
      next();
    });
  });
});
