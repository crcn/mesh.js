var Bus = require('./base');

/**
 */

function RandomBus(busses) {
  this._busses = busses;
}

/**
 */

Bus.extend(RandomBus, {

  /**
   */

  execute: function(operation) {
    return this._busses[Math.floor(Math.random() * this._busses.length)].execute(operation);
  }
});

/**
 */

module.exports = RandomBus;
