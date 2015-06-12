var api    = require("./index");
var expect = require("expect.js");
var mesh   = require("../../../..");

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
      bus({ name: "load", collection: "users", query: { id: "u1" }}).on("end", function() {
        expect(requestOptions.uri).to.be("/login");
        expect(requestOptions.query.userId).to.be("u1");
        next();
      });
    });
  });

  describe("threads#", function() {

    it("ca load all threads", function(next) {
      bus({ name: "load", collection: "threads", multi: true }).on("end", function() {
        expect(requestOptions.uri).to.be("/getThreads");
        next();
      });
    });

    it("ca add a new thread", function(next) {
      bus({ name: "insert", collection: "threads", data: { user: { id: "user1" }, title: "thread1" } }).on("end", function() {
        expect(requestOptions.uri).to.be("/addThread");
        expect(requestOptions.method).to.be("POST");
        expect(requestOptions.data.userId).to.be("user1");
        expect(requestOptions.data.title).to.be("thread1");
        next();
      });
    });
  });

  describe("messages#", function() {

    it("ca load all messages in a thread", function(next) {
      bus({ name: "load", collection: "messages", multi: true, query: { thread: { id: "thread1" } }}).on("end", function() {
        expect(requestOptions.uri).to.be("/getMessages");
        expect(requestOptions.query.threadId).to.be("thread1");
        next();
      });
    });

    it("ca add a new thread", function(next) {
      bus({ name: "insert", collection: "messages", data: { thread: { id: "thread1" }, text: "texttt" } }).on("end", function() {
        expect(requestOptions.uri).to.be("/addMessage");
        expect(requestOptions.method).to.be("POST");
        expect(requestOptions.data.threadId).to.be("thread1");
        expect(requestOptions.data.text).to.be("texttt");
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
