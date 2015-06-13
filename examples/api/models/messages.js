var Collection = require("./base/collection");
var Message    = require("./message");
var mesh       = require("../../..");
var extend     = require("xtend/mutable");

/**
 */

function Messages(properties) {
  Collection.call(this, properties);
}

/**
 */

extend(Messages.prototype, Collection.prototype, {

  /**
   */

  modelClass: Message,

  /**
   */

  getUser: function(onLoad) {
    return new User({
      bus: mesh.attach({ collection: "users", query: { messageId: this.id }})
    }).load(onLoad);
  }
});

/**
 */

module.exports = Messages;
