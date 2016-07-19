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
  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {
      setTimeout(function onTimeout() {
        (self._bus.execute(action) || EmptyResponse.create()).pipeTo(writable);
      }, self._ms);
    });
  }
});

/**
 */

module.exports = DelayedBus;
