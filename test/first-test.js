var crudlet = require("../");
var expect  = require("expect.js");
var through = require("through2");
var _       = require("highland");

describe(__filename + "#", function() {
  it("can be run", function(next) {

    var i = 0;
    var j = 0;

    var startTime = Date.now();

    var db = function(name, properties) {
      i++;
      return _([properties]);
    };

    var dbs = crudlet.first(db, db);
    dbs("load").on("end", function() {
      expect(i).to.be(1);
      next();
    })
  });
});
