var Ship = require("../ship");
var Bullet = require("../bullet");

var classes = { ship: Ship, bullet: Bullet };
module.exports = function(properties) {
  var clazz = classes[properties.type];
  return clazz(properties);
};
