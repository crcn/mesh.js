var mesh = require('mesh');
var Bus  = mesh.Bus;
var Response = mesh.Response;
var sift = require('sift');

/**
 * synchronizes actions against an array of items
 */

function CollectionBus(target) {
  Bus.call(this);
  this.target = target || [];
}

function _oneOrMany(action, items) {
  return action.multi ? items : items.length ? [items[0]] : [];
}

Bus.extend(CollectionBus, {

  /**
   */

  execute: function(action) {
    return Response.create((writable) => {
      switch(action.type) {
        case "insert" : return this._insert(action, writable)
        case "remove" : return this._remove(action, writable)
        case "update" : return this._update(action, writable)
        case "find"   : return this._find(action, writable)
        default       : return writable.close();
      }
    });
  },

  /**
   */

  _insert: function(action, writable) {
    this.target.push(_cloneObject(action.data));
    writable.close();
  },

  /**
   */

  _remove: function(action, writable) {
    this._find2(action).forEach((item) => {
      writable.write(_cloneObject(item));
      this.target.splice(this.target.indexOf(item), 1);
    });
    writable.close();
  },

  /**
   */

  _update: function(action, writable) {
    this._find2(action).forEach((item) => {
      writable.write(_cloneObject(action.data));
      this.target.splice(this.target.indexOf(item), 1, action.data);
    });
    writable.close();
  },

  /**
   */

  _find(action, writable) {
    this._find2(action).forEach((item) => {
      writable.write(_cloneObject(item));
    });
    writable.close();
  },

  /**
   */

  _find2(action) {
    return _oneOrMany(action, this.target.filter(sift(action.query)));
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
