module.exports = {
  __isObservable: true,
  on: function(event, listener) {
    if (!this._listeners) this._listeners = {};
    var listeners;
    if (!(listeners = this._listeners[event])) {
      listeners = this._listeners[event] = [];
    };
    listeners.push(listener);
  },
  off: function(event, listener) {
    if (!this._listeners) return;
    var listeners;
    if (!(listeners = this._listeners[event])) return;
    var i = listeners.indexOf(listener);
    if (~i) listeners.splice(i, 1);
  },
  emit: function(event) {
    if (!this._listeners) return;
    var listeners;
    if (!(listeners = this._listeners[event])) return;
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = listeners.length; i--;) listeners[i].apply(this, args);
  }
};
