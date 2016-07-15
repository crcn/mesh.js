var loki     = require("lokijs");
var mesh     = require('mesh');
var Bus      = mesh.Bus;
var Response = mesh.Response;

/**
 */

function _toArray(item) {
  if (item == void 0) return [];
  return Object.prototype.toString.call(item) === "[object Array]" ? item : [item];
}

/**
 */

function Adapter(target) {
  this.target = target;
  this._collections = {};
}

/**
 */

Object.assign(Adapter.prototype, {

  /**
   */

  run: function(action, onRun) {
    var method = this[action.type];
    if (!method) return onRun();
    if (!action.collectionName) return onRun(new Error("collection must exist"));
    method.call(this, this._collection(action.collectionName), action, onRun);
  },

  /**
   */

  insert: function(collection, options, onRun) {
    onRun(void 0, _toArray(options.data).map(function(item) {
      if (item.$loki) {
        delete item.$loki;
      }
      return collection.insert(item);
    }));
  },

  /**
   */

  update: function(collection, options, onRun) {
    this.find(collection, options, function(err, items) {
      if (err) return onRun(err);
      onRun(void 0, _toArray(items).map(function(item) {
        item = Object.assign(item, options.data);
        collection.update(item);
        return item;
      }));
    });
  },

  /**
   */

  upsert: function(collection, options, onRun) {
    options.multi = false;
    this.find(collection, options, function(err, item) {
      if (err) return onRun(err);

      if (item) {
        item = extend(item, options.data);
        collection.update(item);
        return onRun(void 0, item);
      }

      onRun(void 0, collection.insert(options.data));
    });
  },

  /**
   */

  remove: function(collection, options, onRun) {
    if (options.multi) {
      collection.removeWhere(options.query);
      onRun();
    } else {
      var self = this;
      this.find(collection, options, function(err, item) {
        if (err) return onRun(err);
        if (item) collection.remove(item);
        return onRun();
      });
    }
  },

  /**
   */

  find: function(collection, options, onRun) {
    onRun(void 0, options.multi ? collection.find(options.query) : collection.findOne(options.query));
  },

  /**
   */

  _collection: function(name) {
    if (this._collections[name]) return this._collections[name];
    this._collections[name] = this.target.addCollection(name);
    return this._collections[name];
  }
});
//
// module.exports = function(options) {
//
//   if (!options) options = {};
//
//   var target = options.collections ? options : new loki(options);
//   var db     = new Adapter(target);
//
//   var ret = function(action) {
//     var writable = new stream.Writable();
//
//     process.nextTick(function() {
//       db.run(action, function(err, data) {
//         if (err) return writable.reader.emit("error");
//
//         _toArray(data).forEach(function(data) {
//           writable.write(data);
//         });
//         writable.end();
//       });
//     });
//
//     return writable.reader;
//   };
//
//   ret.target = target;
//
//   return ret;
// };

function LokiDsBus(options) {
  Bus.call(this);
  if (!options) options = {};
  this._db = new Adapter(options.target || new loki(options));
}

Bus.extend(LokiDsBus, {
  execute: function(action) {
    return Response.create((writable) => {
      this._db.run(action, function(err, data) {
        if (err) return writable.abort(err);
        _toArray(data).forEach(function(data) {
          writable.write(data);
        });
        writable.close();
      });
    });
  }
});

module.exports = LokiDsBus;
