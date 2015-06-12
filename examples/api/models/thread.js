var Model    = require("./base/model");
var Messages = require("./messages");
var mesh     = require("mesh");
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

  getMessages: function(onLoad) {
    return new Messages({
      bus: mesh.attach({ collection: "messages", query: { threadId: this.id } }, this.bus)
    }).load(onLoad);
  },

  /**
   */

  getParticipants: function(onLoad) {
    return new Users({
      bus: mesh.attach({ collection: "users", query: { threadId: this.id }}, this.bis)
    }).load(onLoad);
  }
});
