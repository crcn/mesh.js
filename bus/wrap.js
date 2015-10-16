var Bus              = require('./base');
var extend           = require('../internal/extend');
var Response         = require('../response');
var BufferedResponse = require('../response/buffered');

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

extend(Bus, WrapBus, {

  /**
   */

  execute: function(operation) {
    var ret = this._execute(operation);

    // is a readable stream
    if (ret && ret.read)  return ret;
    if (!ret || !ret.then) return BufferedResponse.create(void 0, ret);
    if (ret.then) return Response.create(function(writable) {
      ret.then(writable.end.bind(writable), writable.abort.bind(writable));
    });
  }
});

/**
*/

module.exports =  WrapBus;
