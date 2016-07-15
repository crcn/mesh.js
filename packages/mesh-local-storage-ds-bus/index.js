var MemoryDsBus = require("mesh-memory-ds-bus");
var Bus        = require('mesh/bus/base');


var _store  = process.browser ? require("store") : {
  get: function() { },
  set: function() { }
};

function MeshLocalStorageDsBus(options) {
  if (!options) options = {};

  Bus.call(this);

  this.key   = options.key || 'mesh-data';
  this.store = options.store || _store;
  this._bus  = MemoryDsBus.create({
    source: this.store.get(this.key) || {}
  });
}

/**
*/

Bus.extend(MeshLocalStorageDsBus, {
  execute(action) {
    var ret = this._bus.execute(action);

    if (/remove|update|insert/.test(action.type)) {
      ret.then(() => {
        this.store.set(this.key, this._bus.toJSON());
      });
    }

    return ret;
  }
});

module.exports = MeshLocalStorageDsBus;
