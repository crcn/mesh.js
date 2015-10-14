var Chunk = require('../internal/chunk');
var extend = require('../internal/extend');
var Response = require('./base');

/**
 */

function BufferedResponse(error, chunkValues) {
  Response.call(this);
  this._error       = error;
  this._chunkValues = Array.isArray(chunkValues) ? chunkValues : chunkValues != void 0 ? [chunkValues] : [];
  if (error) {
    this._reject();
  } else {
    this._resolve();
  }
}

/**
 */

extend(Response, BufferedResponse, {
  read: function() {
    if(this._error) {
      return Promise.reject(this._error);
    } else if (!!this._chunkValues.length) {
      var chunk = new Chunk(this._chunkValues.shift());
      return Promise.resolve(chunk);
    } else {
      return Promise.resolve(new Chunk(void 0, true));
    }
  }
});

/**
 */

module.exports =  BufferedResponse;
