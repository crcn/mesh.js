var mesh = require('mesh');
var Bus  = mesh.Bus;
var Response = mesh.Response;
var sift = require('sift');

/**
 * synchronizes actions against an array of items
 */

function ArrayDsBus(target, mutators) {
  Bus.call(this);
  this.target   = target || [];
  this.mutators = mutators || {
    update: function(oldValue, newValue) {
      return newValue;
    },
    insert: function(newValue) {
      return newValue;
    },
    remove: function(newValue) {

    }
  };
}

function _oneOrMany(action, items) {
  return action.multi ? items : items.length ? [items[0]] : [];
}

Bus.extend(ArrayDsBus, {

  /**
   */

  execute: function(action) {
    var self = this;
    return Response.create(function (writable) {
      switch(action.type) {
        case "insert" : return self._insert(action, writable)
        case "remove" : return self._remove(action, writable)
        case "update" : return self._update(action, writable)
        case "find"   : return self._find(action, writable)
        default       : return writable.close();
      }
    });
  },

  /**
   */

  _insert: function(action, writable) {
    this.target.push(this.mutators.insert(_cloneObject(action.data)));
    writable.close();
  },

  /**
   */

  _remove: function(action, writable) {
    this._find2(action).forEach(function (item) {
      writable.write(_cloneObject(item));
      this.mutators.remove(item);
      this.target.splice(this.target.indexOf(item), 1);
    });
    writable.close();
  },

  /**
   */

  _update(action, writable) {
    this._find2(action).forEach((item) => {
      writable.write(_cloneObject(action.data));
      var newItem = this.mutators.update(item, action.data);
      if (newItem !== item) {
        this.target.splice(this.target.indexOf(item), 1, action.data);
      }
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

module.exports = ArrayDsBus;
