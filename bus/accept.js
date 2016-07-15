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

  execute(action) {
    var accepted = this._filter(action);

    if (accepted && accepted.then) {
      return Response.create((writable) => {
        accepted.then((yes) => {
          this._execute(yes, action).pipeTo(writable);
        }, writable.abort.bind(writable));
      });
    }

    return this._execute(accepted, action);
  },

  /**
   */

  _execute(yes, action) {
    return yes ? this._acceptBus.execute(action) : this._rejectBus.execute(action);
  }
});

/**
 */

module.exports =  AcceptBus;
