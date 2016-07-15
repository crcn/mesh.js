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

function _oneOrMany(action, items) {
  return !action.multi && !!items.length ? [items[0]] : items;
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

  execute(action) {
    return this[action.type](action);
  },

  toJSON() {
    return this._items;
  },

  insert(action) {
    if (!action.data) throw new Error('data must exist for insert actions');
    var item = _clone(action.data);
    this._items.push({ data: action.data });
    return _response(_clone([item]));
  },

  find(action) {
    return _response(_oneOrMany(action, this._find(action).map(function(record) {
      return _clone(record.data);
    })));
  },

  remove(action) {
    var records = _oneOrMany(action, this._find(action));
    records.forEach((item) => {
      var i = this._items.indexOf(item);
      if (~i) this._items.splice(i, 1);
    });
    return _response(_recordData(records));
  },

  update(action) {

    var records = _oneOrMany(action, this._find(action));

    records.forEach(function(record) {
      Object.assign(record.data, action.data);
    });

    return _response(_recordData(records));
  },

  _find(action) {
    return this._items.filter(sift({ data: action.query || function() {
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
  execute(action) {
    return /insert|find|remove|update/.test(action.type)    ?
    this._db.collection(action.collectionName).execute(action) :
    EmptyResponse.create();
  }
});

module.exports = MemoryDsBus;
