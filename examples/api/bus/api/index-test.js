var api    = require("./index");
var expect = require("expect.js");
var mesh   = require("mesh");

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
  });

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

    it("can load a user", function(next) {
      bus({ name: "load", collection: "users", data: { id: "u1" }}).on("end", function() {
        expect(requestOptions.uri).to.be("/login");
        expect(requestOptions.query.userId).to.be("u1");
        next();
      });
    });
  });

  describe("caching#", function() {

    var cachedBus;
    var cachedRequestOps;

    beforeEach(function() {

      cachedRequestOps = [];

      cachedBus = api({
        request: function(options, next) {
          cachedRequestOps.push(options);
          next();
        }
      });

      cachedBus = mesh.limit(1, cachedBus);
    });

    it("caches all GET requests", function(next) {
      cachedBus({ method: "GET", path: "/abba" });
      cachedBus({ method: "GET", path: "/baab" });
      cachedBus({ method: "GET", path: "/abba" });
      cachedBus({ method: "GET", path: "/baab" });
      cachedBus({ method: "GET", path: "/abba" }).on("end", function() {
        expect(cachedRequestOps.length).to.be(2);
        next();
      });
    });

    it("busts cached requests when POST is executed", function(next) {
      cachedBus({ method: "GET", path: "/abba" });
      cachedBus({ method: "GET", path: "/abba" });
      cachedBus({ method: "POST", path: "/abba" });
      cachedBus({ method: "GET", path: "/abba" }).on("end", function() {
        expect(cachedRequestOps.length).to.be(2);
        next();
      });
    });

    it("busts cached requests when DELETE is executed", function(next) {
      cachedBus({ method: "GET", path: "/abba" });
      cachedBus({ method: "GET", path: "/abba" });
      cachedBus({ method: "DELETE", path: "/abba" });
      cachedBus({ method: "GET", path: "/abba" }).on("end", function() {
        expect(cachedRequestOps.length).to.be(2);
        next();
      });
    });

    it("busts cached requests when UPDATE is executed", function(next) {
      cachedBus({ method: "GET", path: "/abba" });
      cachedBus({ method: "GET", path: "/abba" });
      cachedBus({ method: "UPDATE", path: "/abba" });
      cachedBus({ method: "GET", path: "/abba" }).on("end", function() {
        expect(cachedRequestOps.length).to.be(2);
        next();
      });
    });

    it("only busts cache for a given path", function(next) {
      cachedBus({ method: "GET", path: "/abba" });
      cachedBus({ method: "GET", path: "/baab" });
      cachedBus({ method: "GET", path: "/baab" });
      cachedBus({ method: "GET", path: "/abba" });
      cachedBus({ method: "UPDATE", path: "/abba" });
      cachedBus({ method: "GET", path: "/baab" });
      cachedBus({ method: "GET", path: "/abba" }).on("end", function() {
        expect(cachedRequestOps.length).to.be(3);
        next();
      });
    });
  });
});
