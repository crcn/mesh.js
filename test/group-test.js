var mesh = require("../");
var expect  = require("expect.js");
var through = require("through2");
var _       = require("highland");

describe(__filename + "#", function() {

  it("accepts arrays", function(next) {

    var source = [
        mesh.wrap(function(o, n) {
          n(void 0, 1);
        }),
        mesh.wrap(function(o, n) {
          n(void 0, 2);
        })
    ];

    var bus = mesh.parallel(source);

    bus(mesh.op("a")).
    pipe(_.pipeline(_.collect)).
    on("data", function(data) {
      expect(data[0]).to.be(1);
      expect(data[1]).to.be(2);
      next();
    });
  });

  it("can push a new event bus handler at the end", function(next) {

    var source = [
      mesh.accept("a", mesh.wrapCallback(function(operation, next) {
        next(void 0, 1);
      }))
    ];

    var bus = mesh.first(source);

    source.push(mesh.accept("b", mesh.wrapCallback(function(operation, next) {
      next(void 0, 2);
    })));

    source.push(mesh.accept("a", mesh.wrapCallback(function(operation, next) {
      next(void 0, 2);
    })));

    bus(mesh.op("a")).on("data", function(data) {
      expect(data).to.be(1);
      bus(mesh.op("b")).on("data", function(data) {
        expect(data).to.be(2);
        next();
      });
    });
  });

  it("can remove a bus", function(next) {

    var source = [
      mesh.accept("a", mesh.wrapCallback(function(operation, next) {
        next(void 0, 1);
      }))
    ];

    var bus = mesh.first(source);

    var a2 = mesh.accept("a", mesh.wrapCallback(function(operation, next) {
      next(void 0, 2);
    }));

    source.unshift(a2);

    bus(mesh.op("a")).on("data", function(data) {
      expect(data).to.be(2);
      source.splice(0, 1);
      bus(mesh.op("a")).on("data", function(data) {
        expect(data).to.be(1);
        next();
      });
    });
  });

  it("can add multiple busses", function(next) {

    var source = [];

    var bus = mesh.parallel(source);

    source.push(
      mesh.accept("a", mesh.wrapCallback(function(operation, next) {
        next(void 0, 1);
      })),
      mesh.accept("a", mesh.wrapCallback(function(operation, next) {
        next(void 0, 2);
      }))
    );

    bus(mesh.op("a")).
    pipe(_.pipeline(_.collect)).
    on("data", function(data) {
      expect(data[0]).to.be(1);
      expect(data[1]).to.be(2);
      next();
    });
  });

  it("can push a new event bus handler at the beginning", function(next) {

    var source = [
      mesh.accept("a", mesh.wrapCallback(function(operation, next) {
        next(void 0, 1);
      }))
    ];

    var bus = mesh.first(source);

    source.unshift(mesh.accept("a", mesh.wrapCallback(function(operation, next) {
      next(void 0, 2);
    })));

    bus(mesh.op("a")).on("data", function(data) {
      expect(data).to.be(2);
      next();
    });
  });

  it("accepts sources as a function", function(next) {

    var source = function(operation) {
      return mesh.accept("a", mesh.wrapCallback(function(operation, next) {
        next(void 0, 1);
      }))(operation);
    };

    var bus = mesh.first(source);

    bus(mesh.op("a")).on("data", function(data) {
      expect(data).to.be(1);
      next();
    });
  });
});
