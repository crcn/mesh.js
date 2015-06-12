var api    = require("./index");
var expect = require("expect.js");

describe(__filename + "#", function() {

  var bus;
  var requestOptions;

  beforeEach(function() {
    bus = api({
      request: function(options, next) {
        requestOptions = options;
        next();
      }
    });
  })
  describe("users#", function() {

    it("can register a user", function(next) {
      bus({ name: "insert", collection: "users" }).on("end", function() {
        expect(requestOptions.uri).to.be("/register");
        next();
      });
    });

    it("can update a user", function(next) {
      bus({ name: "update", collection: "users", data: { id: "u1" }}).on("end", function() {
        expect(requestOptions.uri).to.be("/updateUser");
        expect(requestOptions.query.userId).to.be("u1");
        next();
      });
    });
  });
});
