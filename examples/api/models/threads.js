var Collection = require("./base/collection");
var mesh       = require("mesh");
var Users      = require("./users");
var Thread     = require("./thread");
var extend     = require("xtend/mutable");

/**
 */

function Threads(properties) {
  Collection.call(this, properties);
}

/**
 */

extend(Threads.prototype, Collection.prototype, {

  /**
   */

  modelClass: Thread
});

/**
 */

module.exports = Threads;
