var AcceptBus = require("./accept");

/**
 */

function RejectBus(filter, rejectBus, acceptBus) {
  this._bus = new AcceptBus(filter, acceptBus, rejectBus);
}

/**
 */

Object.assign(RejectBus.prototype, {

  /**
   */

  execute: function(operation) {
    return this._bus.execute(operation);
  }
});

/**
 */

module.exports =  RejectBus;
