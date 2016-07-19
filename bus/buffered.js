var Bus = require('./base');
var BufferedResponse = require('../response/buffered');

/**
 */

function BufferedBus(error, chunkValues) {
  this._error       = error;
  this._chunkValues = chunkValues;
}

/**
 */

 Bus.extend(BufferedBus, {

  /**
   */

  execute: function (action) {
    return BufferedResponse.create(this._error, this._chunkValues);
  }
});

/**
 */

module.exports =  BufferedBus;
