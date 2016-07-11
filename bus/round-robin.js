var Bus = require('./base');
var EmptyResponse = require('../response/empty');

/**
 */

function RoundRobinBus(busses) {
  this._busses = busses;
  this._i = 0;
}

/**
 */

Bus.extend(RoundRobinBus, {

  /**
   */

  execute: function(operation) {
    var ret = this._busses[this._i].execute(operation);
    this._i = (this._i + 1) % this._busses.length;
    return ret;
  }
});

/**
 */

module.exports = RoundRobinBus;
