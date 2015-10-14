var Bus = require('./base');
var NoopBus = require('./noop');
var extend = require('../internal/extend');
var AsyncResponse = require("../response/async");
var pipe = require("../internal/pipe-stream");

/**
 */

function AcceptBus(filter, acceptBus, rejectBus) {
  this._filter    = filter;
  this._acceptBus = acceptBus || NoopBus.create();
  this._rejectBus = rejectBus || NoopBus.create();
}

/**
 */

extend(Bus, AcceptBus, {

  /**
   */

  execute: function(operation) {
    var accepted = this._filter(operation);

    if (accepted && accepted.then) {
      return AsyncResponse.create((writable) => {
        accepted.then((yes) => {
          pipe(this._execute(yes, operation), writable, { end: true });
        }, writable.error.bind(writable));
      });
    }

    return this._execute(accepted, operation);
  },

  /**
   */

  _execute: function(yes, operation) {
    return yes ? this._acceptBus.execute(operation) : this._rejectBus.execute(operation);
  }
});

/**
 */

module.exports =  AcceptBus;
