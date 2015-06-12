var fake    = require("./index");
var expect = require("expect.js");
var mesh   = require("mesh");

describe(__filename + "#", function() {

  var bus;
  var requestOptions;

  beforeEach(function() {
    bus = fake({
      fixtures: {
        users: [{ id: "user1" }]
      }
    })
  });

  it("can load fixture data based on the query ", function(next) {
    bus({ fake: true, name: "load", collection: "users", query: { id: "user1" }}).on("data", function(data) {
      expect(data.id).to.be("user1");
      next();
    });
  });
});
