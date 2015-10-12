var Bus              = require("./base");
var extend           = require("../internal/extend");
var AsyncResponse    = require("../response/async");
var BufferedResponse = require("../response/buffered");

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
    if (!ret || !ret.then) return new BufferedResponse(void 0, ret);
    if (ret.then) return new AsyncResponse(function(writable) {
      ret.then(writable.end.bind(writable), writable.error.bind(writable));
    });

    return new AsyncResponse(function(writable) {

    });
  }
});

/**
*/

module.exports =  WrapBus;
