var mesh = require('mesh');
var Bus  = mesh.Bus;
var Response = mesh.Response;
var sift = require('sift');

/**
 * synchronizes operations against an array of items
 */

function CollectionBus(target) {
  Bus.call(this);
  this.target = target || [];
}

function _oneOrMany(operation, items) {
  return operation.multi ? items : items.length ? [items[0]] : [];
}

Bus.extend(CollectionBus, {

  /**
   */

  execute: function(operation) {
    return Response.create((writable) => {
      switch(operation.action) {
        case "insert" : return this._insert(operation, writable)
        case "remove" : return this._remove(operation, writable)
        case "update" : return this._update(operation, writable)
        case "load"   : return this._load(operation, writable)
        default       : return writable.close();
      }
    });
  },

  /**
   */

  _insert: function(operation, writable) {
    this.target.push(_cloneObject(operation.data));
    writable.close();
  },

  /**
   */

  _remove: function(operation, writable) {
    this._find(operation).forEach((item) => {
      writable.write(_cloneObject(item));
      this.target.splice(this.target.indexOf(item), 1);
    });
    writable.close();
  },

  /**
   */

  _update: function(operation, writable) {
    this._find(operation).forEach((item) => {
      writable.write(_cloneObject(operation.data));
      this.target.splice(this.target.indexOf(item), 1, operation.data);
    });
    writable.close();
  },

  /**
   */

  _load(operation, writable) {
    this._find(operation).forEach((item) => {
      writable.write(_cloneObject(item));
    });
    writable.close();
  },

  /**
   */

  _find(operation) {
    return _oneOrMany(operation, this.target.filter(sift(operation.query)));
  }
});

/**
 */

function _cloneObject(object) {
    return JSON.parse(JSON.stringify(object));
}

/**
 */

module.exports = CollectionBus;
