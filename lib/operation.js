var extend = require("xtend/mutable");

/**
 */

function Operation(name, options) {
  if (!options) options = {};
  extend(this, options);
  this.name = name;
}

/**
 */

module.exports = function(name, options) {
  return new Operation(name, options);
};
