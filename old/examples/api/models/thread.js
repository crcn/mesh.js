var Model    = require("./base/model");
var Messages = require("./messages");
var Message  = require("./message");
var mesh     = require("../../..");
var extend   = require("xtend/mutable");

/**
 */

function Thread(properties) {
  Model.call(this, properties);
}

/**
 */

extend(Thread.prototype, Model.prototype, {

  /**
   */

  addMessage: function(text, onInsert) {
    return new Message({
      bus: mesh.attach({ collection: "messages", data: { threadId: this.id, text: text }}, this.bus)
    }).insert(onInsert);
  },

  /**
   */

  getMessages: function(onLoad) {
    return new Messages({
      bus: mesh.attach({ collection: "messages", query: { threadId: this.id } }, this.bus)
    }).load(onLoad);
  }
});

module.exports = Thread;
