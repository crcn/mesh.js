var crudlet = require("../");
var expect  = require("expect.js");

describe(__filename + "#", function() {

  var db;

  beforeEach(function() {
    db = crudlet(
      crudlet.db.memory("id")
    );
  })

  it("cannot insert an item without a collection", function(next) {
    db.insert({ name: "abba" }, function(err) {
      expect(err).not.to.be(void 0);
      next();
    });
  });

  it("can insert an item", function() {
    db.insert({ data: { name: "abba" }, collection: "people" });
    expect(db.target._db.people[0].name).to.be("abba");
  });

  it("can update with a query", function() {
    db.insert({ data: { name: "abba" }, collection: "people" });
    db.update({ data: { name: "baab" }, query: { name: "abba" }, collection: "people" });
    expect(db.target._db.people[0].name).to.be("baab");
  });

  it("can update without a query", function() {
    db.insert({ data: { id: 1, name: "abba" }, collection: "people" });
    db.update({ data: { id: 1, name: "baab" }, collection: "people" });
    expect(db.target._db.people[0].name).to.be("baab");
  });

  it("can load one item", function(next) {
    db.insert({ data: { name: "abba" }, collection: "people" });
    db.insert({ data: { name: "abba" }, collection: "people" });
    db.insert({ data: { name: "baab" }, collection: "people" });
    db.load({ query: { name: "abba" }, collection: "people" }, function (err, item) {
      expect(item.name).to.be("abba");
      next();
    });
  });

  it("can load multiple items", function(next) {
    db.insert({ data: { name: "abba" }, collection: "people" });
    db.insert({ data: { name: "abba" }, collection: "people" });
    db.load({ query: { name: "abba" }, multi: true, collection: "people" }, function (err, items) {
      expect(items.length).to.be(2);
      next();
    });
  });
});