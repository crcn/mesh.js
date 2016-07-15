var Bus              = require('./base');
var Response         = require('../response');
var BufferedResponse = require('../response/buffered');
var WrapResponse     = require('../response/wrap');

/**
*/

function WrapBus(execute) {

  // node style? (next(err, result))
  if (execute.length >= 2) {
    this._execute = function(operation) {
      return new Promise((resolve, reject) => {
        execute(operation, function(err, result) {
          if (err) return reject(err);
          resolve.apply(this, Array.prototype.slice.call(arguments, 1));
        });
      })
    }
  } else {
    this._execute = execute;
  }
}

/**
*/

Bus.extend(WrapBus, {

  /**
   */

  execute: function(operation) {
    return WrapResponse.create(this._execute(operation));
  }
});

WrapBus.create = function(callback) {
  if (callback.execute) return callback;
  return Bus.create.call(WrapBus, callback);
};

/**
*/

module.exports =  WrapBus;
