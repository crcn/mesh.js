var crudlet = require("../");
var expect  = require("expect.js");
var through = require("through2");
var _       = require("highland");
var Stream  = require("stream").Stream;

describe(__filename + "#", function() {

  it("passes a new operation to the database in the crudlet", function(next) {

    function db(name, props) {
      expect(props.data).to.be("a");
      return _([]);
    }

    db("insert", { data: "a" }).on("data",function(){}).on("end", next);
  });


  it("can write data to the stream", function(next) {
    function db(name, props) {
      return _([{a:1}]);
    }

    db("insert").on("data", function(data) {
      expect(data.a).to.be(1);
    }).on("end", next);
  });

  it("emits an error if the next param gets an error", function(next) {
    function db(name, props) {
      return through.obj(function(operation, enc, next) {
        next(new Error("abba"));
      });
    }

    var stream = db();

    stream.once("error", function(err) {
      expect(err.message).to.be("abba");
      next();
    });

    stream.end(crudlet.operation("insert"));
  });
});
