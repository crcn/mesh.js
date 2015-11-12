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

function _recordData(records) {
  return records.map(function(record) {
    return record.data;
  });
}

function MemoryCollection(db) {
  this._db    = db;
  this._items = [];
}

Object.assign(MemoryCollection.prototype, {

  execute(operation) {
    return this[operation.action](operation);
  },

  toJSON() {
    return this._items;
  },

  insert(operation) {
    if (!operation.data) throw new Error('data must exist for insert operations');
    var item = _clone(operation.data);
    this._items.push({ data: operation.data });
    return _response(_clone([item]));
  },

  load(operation) {
    return _response(_oneOrMany(operation, this._find(operation).map(function(record) {
      return _clone(record.data);
    })));
  },

  remove(operation) {
    var records = _oneOrMany(operation, this._find(operation));
    records.forEach((item) => {
      var i = this._items.indexOf(item);
      if (~i) this._items.splice(i, 1);
    });
    return _response(_recordData(records));
  },

  update(operation) {

    var records = _oneOrMany(operation, this._find(operation));

    records.forEach(function(record) {
      Object.assign(record.data, operation.data);
    });

    return _response(_recordData(records));
  },

  _find(operation) {
    return this._items.filter(sift({ data: operation.query || function() {
      return true;
    }}));
  }
})

function MemoryDs(options) {
  this._collections = {};
  if (options.source) {
    for (var collectionName in options.source) {
      this.collection(collectionName)._items = _clone(options.source[collectionName]);
    }
  }
}

Object.assign(MemoryDs.prototype, {
  collection(name) {
    if (name == void 0) {
      throw new Error('collection name must not be undefined');
    }
    return this._collections[name] || (this._collections[name] = new MemoryCollection(this));
  },
  toJSON() {
    var data = {};
    for (var collectionName in this._collections) {
      data[collectionName] = this._collections[collectionName].toJSON();
    }
    return data;
  }
});

function MemoryDsBus(options) {
  if (!options) options = {};
  Bus.call(this);
  this._db = new MemoryDs(options);
}

Bus.extend(MemoryDsBus, {
  toJSON() {
    return this._db.toJSON();
  },
  execute(operation) {
    return /insert|load|remove|update/.test(operation.action)    ?
    this._db.collection(operation.collection).execute(operation) :
    EmptyResponse.create();
  }
});

module.exports = MemoryDsBus;
