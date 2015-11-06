var sift      = require('sift');
var mesh      = require('mesh');
var Bus       = mesh.Bus;
var AcceptBus = mesh.AcceptBus;
var Response  = mesh.Response;
var EmptyResponse = mesh.EmptyResponse;
var BufferedResponse = mesh.BufferedResponse;


function _clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function _response(results) {
  return BufferedResponse.create(void 0, results);
}

function _oneOrMany(operation, items) {
  return !operation.multi && !!items.length ? [items[0]] : items;
}

function MemoryCollection(db) {
  this._db    = db;
  this._items = [];
}

Object.assign(MemoryCollection.prototype, {

  execute: function(operation) {
    return this[operation.action](operation);
  },

  insert: function(operation) {
    var item = _clone(operation.data);
    this._items.push(item);
    return _response(_clone([item]));
  },

  load: function(operation) {
    var items = sift(operation.query || function() {
      return true;
    }, _clone(this._items));
    return _response(_oneOrMany(operation, items));
  },

  remove: function(operation) {
    var items = sift(operation.query, this._items);
    items     = _oneOrMany(operation, items);
    items.forEach((item) => {
      var i = this._items.indexOf(item);
      if (~i) this._items.splice(i, 1);
    });
    return _response(items);
  },

  update: function(operation) {

    var items = [];

    sift(operation.query, this._items).forEach(function(item) {
      Object.assign(item, operation.data);
      items.push(item);
    });

    return _response(items);
  }
})


function MemoryDs(initialData) {

    this._collections = {};
    if (initialData) {
      for (var collectionName in initialData) {
        this.collection(collectionName)._items = _clone(initialData[collectionName]);
      }
    }
}

Object.assign(MemoryDs.prototype, {
  collection: function(name) {
    if (name == void 0) {
      throw new Error('collection name must not be undefined');
    }
    return this._collections[name] || (this._collections[name] = new MemoryCollection(this));
  }
});


function MemoryDsBus(initialData) {
  Bus.call(this);
  this._db = new MemoryDs(initialData);
}

Bus.extend(MemoryDsBus, {
  execute: function(operation) {
    return /insert|load|remove|update/.test(operation.action)    ?
    this._db.collection(operation.collection).execute(operation) :
    EmptyResponse.create();
  }
});

module.exports = MemoryDsBus;
