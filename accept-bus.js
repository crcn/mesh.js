
/**
 */

function AcceptBus(filter, acceptBus, rejectBus) {
  this._filter    = filter;
  this._acceptBus = acceptBus;
  this._rejectBus = rejectBus;
}

/**
 */

Object.assign(AcceptBus.prototype, {

  /**
   */

  execute: function(operation) {
    return this.filter(operation) ? this._acceptBus(operation) : this._rejectBus(operation);
  }
});

/**
 */

export default AcceptBus;
