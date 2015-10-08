import NoopBus from "./noop-bus";

/**
 */

function AcceptBus(filter, acceptBus, rejectBus) {
  this._filter    = filter;
  this._acceptBus = acceptBus || new NoopBus();
  this._rejectBus = rejectBus || new NoopBus();
}

/**
 */

Object.assign(AcceptBus.prototype, {

  /**
   */

  execute: function(operation) {
    return this._filter(operation) ? this._acceptBus.execute(operation) : this._rejectBus.execute(operation);
  }
});

/**
 */

export default AcceptBus;
