var Bus = require('./base');
var Response = require('../response');

/**
 */

function DelayedBus(bus, ms) {
  this._ms  = ms;
  this._bus = bus;
}

/**
 */

Bus.extend(DelayedBus, {
  execute: function(operation) {
    return Response.create((writable) => {
      setTimeout(() => {
        this._bus.execute(operation).pipeTo(writable);
      }, this._ms);
    });
  }
});

/**
 */

module.exports = DelayedBus;
