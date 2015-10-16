var Bus = require('./base');
var NoopBus = require('./noop');
var Response = require('../response');

/**
 */

function AcceptBus(filter, acceptBus, rejectBus) {
  this._filter    = filter;
  this._acceptBus = acceptBus || NoopBus.create();
  this._rejectBus = rejectBus || NoopBus.create();
}

/**
 */

Bus.extend(AcceptBus, {

  /**
   */

  execute: function(operation) {
    var accepted = this._filter(operation);

    if (accepted && accepted.then) {
      return Response.create((writable) => {
        accepted.then((yes) => {
          this._execute(yes, operation).pipeTo(writable);
        }, writable.abort.bind(writable));
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
