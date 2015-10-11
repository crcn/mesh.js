var Bus = require("./base");
var NoopBus = require("./noop");
var extend = require("../internal/extend");

/**
 */

function AcceptBus(filter, acceptBus, rejectBus) {
  this._filter    = filter;
  this._acceptBus = acceptBus || new NoopBus();
  this._rejectBus = rejectBus || new NoopBus();
}

/**
 */

extend(Bus, AcceptBus, {

  /**
   */

  execute: function(operation) {
    return this._filter(operation) ? this._acceptBus.execute(operation) : this._rejectBus.execute(operation);
  }
});

/**
 */

module.exports =  AcceptBus;
