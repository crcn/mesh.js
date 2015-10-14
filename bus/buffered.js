var Bus = require('./base');
var extend = require('../internal/extend');
var BufferedResponse = require('../response/buffered');

/**
 */

function BufferedBus(error, chunkValues) {
  this._error       = error;
  this._chunkValues = chunkValues;
}

/**
 */

extend(Bus, BufferedBus, {

  /**
   */
   
  execute: function(operation) {
    return new BufferedResponse(this._error, this._chunkValues);
  }
});

/**
 */

module.exports =  BufferedBus;
