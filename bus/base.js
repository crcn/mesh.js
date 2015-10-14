
/**
 */

function Bus() {

}

/**
 */

Object.assign(Bus.prototype, {

  /**
   */

  execute: function(operation) {
    // OVERRIDE ME
  }
});

/**
 */

Bus.create = require('../internal/create-object');

/**
 */

module.exports = Bus;
