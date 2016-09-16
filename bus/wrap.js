var Bus              = require('./base');
var Response         = require('../response');
var BufferedResponse = require('../response/buffered');
var WrapResponse     = require('../response/wrap');

/**
*/

function WrapBus(handler) {
  var self = this;

  if (handler.execute) {
    this._execute = handler.execute.bind(handler);
  // node style? (next(err, result))
  } else if (handler.length >= 2) {
    this._execute = function(action) {
      return new Promise(function run(resolve, reject) {
        handler(action, function (err, result) {
          if (err) return reject(err);
          resolve.apply(self, Array.prototype.slice.call(arguments, 1));
        });
      });
    };
  } else {
    this._execute = handler;
  }
}

/**
*/

Bus.extend(WrapBus, {

  /**
   */

  execute: function (action) {
    try {
      return WrapResponse.create(this._execute(action));
    } catch(e) {
      return BufferedResponse.create(e);
    }
  }
});

WrapBus.create = function (callback) {
  return Bus.create.call(WrapBus, callback);
};

/**
*/

module.exports =  WrapBus;
