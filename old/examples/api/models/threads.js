var Collection = require("./base/collection");
var mesh       = require("../../..");
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

  modelClass: Thread,

  /**
   */

  create: function(onCreate) {
    return this.createModel().insert(onCreate);
  }
});

/**
 */

module.exports = Threads;
