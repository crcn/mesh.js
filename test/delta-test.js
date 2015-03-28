var crudlet = require("../");
var expect  = require("expect.js");
var through = require("through2");

describe(__filename + "#", function() {
  it("can pipe only changed data", function(next) {

    var db1 = function() {
      return through.obj(function(operation, enc, next) {
        this.push(operation.data);
        next();
      });
    };

    var stream = db1();

    var c = stream.pipe(crudlet.delta());
    c.once("data", function(data) {
      expect(data.name).to.be("abba");
      c.once("data", function(data) {
        expect(data.name).to.be(void 0);
        expect(data.age).to.be(19);
        c.once("end", function() {
          next();
        });
        stream.end();
      });
      stream.write(crudlet.operation("update", { data: { age: 19 }}));
    });

    stream.write(crudlet.operation("update", { data: { name: "abba" }}));
  });
});
