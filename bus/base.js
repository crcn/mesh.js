var extend = require('../internal/extend');

/**
 */

function Bus() {

}

/**
 */

extend(Bus, {

  /**
   */

  execute: function(operation) {
    // OVERRIDE ME
  }
});

/**
 */

Bus.create = require('../internal/create-object');
Bus.extend = extend;

/**
 */

module.exports = Bus;
