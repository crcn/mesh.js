var Bus = require('./base');
var Response = require('../response');
var EmptyResponse = require('../response/empty');

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
        (this._bus.execute(operation) || EmptyResponse.create()).pipeTo(writable);
      }, this._ms);
    });
  }
});

/**
 */

module.exports = DelayedBus;
