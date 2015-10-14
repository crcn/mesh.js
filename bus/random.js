var Bus = require('./base');
var extend = require('../internal/extend');

/**
 */

function RandomBus(busses) {
  this._busses = busses;
}

/**
 */

extend(Bus, RandomBus, {

  /**
   */

  execute: function(operation) {
    return this._busses[Math.floor(Math.random() * this._busses.length)].execute(operation);
  }
});

/**
 */

module.exports = RandomBus;
