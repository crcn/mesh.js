var MemoryDsBus = require("mesh-memory-ds-bus");

var store  = process.browser ? require("store") : {
  get: function() { },
  set: function() { }
};

/**
 */

function LocalStorageDatabase(options) {

  if (!options) options = {};
  if (!options.name) options.name = "localStorage";
  this.constructor.parent.call(this, options);

  this.storageKey = this.options.storageKey || "cdb";
  this.store      = this.options.store      || store;

  this.db         = this.store.get(this.storageKey) || {};

  var self = this;
}

/**
 */

MemoryDatabase.extend(LocalStorageDatabase, {
  run: function(operation, onRun) {
    var self = this;

    this.constructor.parent.prototype.run.call(this, operation, function(err, result) {

      if (!/load/.test(operation.name)) {
        self._save();
      }

      onRun.apply(self, arguments);
    });
  },
  _save: function() {
    this.store.set(this.storageKey, this.db);
  }
});

/**
 */

module.exports = MemoryDatabase.getStreamer(LocalStorageDatabase);
