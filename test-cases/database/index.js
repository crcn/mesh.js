var mesh   = require("../..");
var expect = require("expect.js");
var _      = require("highland");

module.exports = function(createDb) {

  var cases = {};
  var db;

  function it(description, run) {
    cases[description] = function(next) {
      if (!next) next = function() { };
      db = mesh.limit(1, createDb());
      run(next);
    };
    return cases[description];
  }

  var insertOneItem = it("can insert one item", function(next) {
    db({ name: "insert", collection: "items", data: { name: "a" }}).on("data", function(data) {
      expect(data.name).to.be("a");
      next();
    });
  });

  var insertMultipleItems = it("can insert multiple items", function(next) {
    db(mesh.op("insert", {
      collection: "items",
      data: [
        { name: "a", count: 1 },
        { name: "b", count: 1 },
        { name: "c", count: 2 }
      ]
    })).
    pipe(_.pipeline(_.collect)).
    on("data", function(data) {
      expect(data.length).to.be(3);
      next();
    });
  });

  it("can load one item", function(next) {
    insertOneItem();
    db(mesh.op("load", {
      collection: "items",
      query: { name: "a" }
    })).on("data", function(data) {
      expect(data.name).to.be("a");
      next();
    });
  });

  it("can load multiple items", function(next) {
    insertMultipleItems();
    db(mesh.op("load", {
      collection: "items",
      multi: true,
      query: { count: 1 }
    })).
    pipe(_.pipeline(_.collect)).
    on("data", function(data) {
      expect(data.length).to.be(2);
      next();
    });
  });

  it("can load all items", function(next) {
    insertMultipleItems();
    db(mesh.op("load", {
      collection: "items",
      multi: true
    })).
    pipe(_.pipeline(_.collect)).
    on("data", function(data) {
      expect(data.length).to.be(3);
      next();
    });
  });

  it("can update one item", function(next) {
    insertMultipleItems();

    db(mesh.op("update", {
      collection: "items",
      query: { count: 1 },
      data: { count: 3 }
    }));

    db(mesh.op("load", {
      collection: "items",
      multi: true,
      query: { count: 3 }
    })).
    pipe(_.pipeline(_.collect)).
    on("data", function(data) {
      expect(data.length).to.be(1);
      next();
    });
  });

  it("can update multiple items", function(next) {
    insertMultipleItems();

    db(mesh.op("update", {
      collection: "items",
      query: { count: 1 },
      multi: true,
      data: { count: 3 }
    }));

    db(mesh.op("load", {
      collection: "items",
      multi: true,
      query: { count: 3 }
    })).
    pipe(_.pipeline(_.collect)).
    on("data", function(data) {
      expect(data.length).to.be(2);
      next();
    });
  });

  it("can remove one item", function(next) {
    insertMultipleItems();

    db(mesh.op("remove", {
      collection: "items",
      query: { count: 1 }
    }));

    db(mesh.op("load", {
      collection: "items",
      multi: true
    })).
    pipe(_.pipeline(_.collect)).
    on("data", function(data) {
      expect(data.length).to.be(2);
      next();
    });
  });

  it("can remove multiple items", function(next) {
    insertMultipleItems();

    db(mesh.op("remove", {
      collection: "items",
      multi: true,
      query: { count: 1 }
    }));

    db(mesh.op("load", {
      collection: "items",
      multi: true
    })).
    pipe(_.pipeline(_.collect)).
    on("data", function(data) {
      expect(data.length).to.be(1);
      next();
    });
  });

  return cases;
};
