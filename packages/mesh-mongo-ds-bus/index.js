var mesh         = require('mesh');
var EventEmitter = require("events").EventEmitter;
var MongoClient  = require("mongodb").MongoClient;
var Response     = mesh.Response;
var Bus          = mesh.Bus;

/**
 */

function Adapter(options) {
  MongoClient.connect(options, this._onConnection.bind(this));
  this._collections = {};
  this.idProperty   = "_id";
}

/**
 */

Object.assign(Adapter.prototype, EventEmitter.prototype, {

  /**
   */

  run: function(action, onRun) {
    if (!this.target) return this.once("connect", this.run.bind(this, action, onRun));
    if (!action.collectionName) return onRun(new Error("a collection must exist"));
    var method = this[action.type];
    if (!method) return onRun();
    var collection = this._collection(action);
    method.call(this, collection, action, onRun);
  },

  /**
   */

  insert: function(collection, action, onRun) {
    collection.insert(action.data, function(err, result) {
      if (err) return onRun(err);
      return onRun(void 0, result.ops);
    });
  },

  /**
   */

  find: function(collection, action, onRun) {
    var query = action.query || {};
    if (action.multi) {
      onRun(void 0, collection.find(query));
    } else {
      collection.findOne(query, onRun);
    }
  },

  /**
   */

  remove: function(collection, action, onRun) {
    var query = action.query || {};
    if (action.multi) {
      collection.remove(query, onRun);
    } else {
      collection.removeOne(query, onRun);
    }
  },

  /**
   */

  update: function(collection, action, onRun) {
    var query = action.query || {};
    if (action.multi) {
      collection.update(query, { $set: action.data }, { multi: true }, onRun);
    } else {
      collection.updateOne(query, { $set: action.data }, onRun);
    }
  },

  /**
   */

  _collection: function(action) {
    var collection = this._collections[action.collectionName];
    if (collection) return collection;
    collection = this._collections[action.collectionName] = this.target.collection(action.collectionName);
    return collection;
  },

  /**
   */

  _onConnection: function(err, target) {
    if (err) this.emit(err);
    this.target = target;
    this.emit("connect");
  }
});

/**
 */

function _toArray(value) {
  if (value == void 0) return [];
  return Object.prototype.toString.call(value) === "[object Array]" ? value : [value];
}

function MongoDsBus(options) {
  this.adapter = new Adapter(options);
}

Bus.extend(MongoDsBus, {
  execute: function(action) {
    return Response.create((writable) => {
      this.adapter.run(action, (err, result) => {
        if (err) return writable.abort(err);
        if (result && result.each) {
          var next = function() {
            result.nextObject((err, item) => {
              if (err) return writable.abort(err);
              if (!item) return writable.close();
              writable.write(item).then(next);
            })
          };
          next();
        } else {
          _toArray(result).forEach((value) => {
            writable.write(value);
          });
          writable.close();
        }
      });
    });
  }
});

module.exports = MongoDsBus;
