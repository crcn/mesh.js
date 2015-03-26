var Base   = require("./base");
var sift   = require("sift");
var extend = require("deep-extend");

function MemoryDatabase () {
  this._db = {};
}

function _json (data) {
  return JSON.parse(JSON.stringify(data));
}

Base.extend(MemoryDatabase, {

  /**
   */

  run: function(operation, options, onRun) {

    // ignore
    if (!(operation in this)) return onRun();
    if (!options.collection) return onRun(new Error("collection must exist"));

    this[operation].call(this, this._collection(options), options, onRun);
  },

  /**
   */

  insert: function(collection, options, onRun) {
    var ret = _json(options.data);
    collection.push(ret);
    onRun(void 0, { data: ret });
  },

  /**
   */

  update: function(collection, options, onRun) {
    var item = sift(options.query, collection).shift();

    if (item) {
      extend(item, _json(options.data));
    } else {
      return onRun();
    }

    onRun(void 0, item);
  },

  /**
   */

  remove: function(collection, options, onRun) {

  },

  /**
   */

  load: function(collection, options, onFind) {
    var items = sift(options.query, collection);
    onFind(void 0, options.multi ? items : items.shift());
  },

  /**
   */

  _collection: function(options) {
    return this._db[options.collection] || (this._db[options.collection] = []);
  },

  /**
   */

  _getJSON: function(data) {
    return JSON.parse(JSON.stringify(data));
  }
});

/**
 */

MemoryDatabase.create = function() {
  return new MemoryDatabase();
}

/**
 */

module.exports = MemoryDatabase;