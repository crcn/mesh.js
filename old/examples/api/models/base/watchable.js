var extend       = require("xtend/mutable");
var EventEmitter = require("events").EventEmitter;

/**
 */

function WatchableObject(properties) {
  extend(this, properties || {});
  EventEmitter.call(this);
}

/**
 */

extend(WatchableObject.prototype, EventEmitter.prototype, {

  /**
   */

  setProperties: function(properties) {
    extend(this, properties || {});
    this.emit("change");
  },

  /**
   */

  watch: function(listener) {
    this.on("change", listener);
    return {
      dispose: this.removeListener.bind(this, "change", listener)
    };
  }
});

/**
 */

module.exports = WatchableObject;
