var mesh = require("mesh");
var sift = require("sift");

module.exports = function(bus) {
  return mesh.tailable(bus, function(a, b) {
    return b.name !== "load" && (!a.q || sift(a.q)(b));
  });
};
