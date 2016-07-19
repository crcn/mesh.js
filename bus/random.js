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

  execute: function (action) {
    return this._busses[Math.floor(Math.random() * this._busses.length)].execute(action);
  }
});

/**
 */

module.exports = RandomBus;
