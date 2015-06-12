var extend    = require("xtend/mutable");
var Watchable = require("./watchable");
var watchProperty = require("./watch-property");

/**
 */

function BaseModel(properties) {
  Watchable.call(this, properties);
  watchProperty(this, "data", this._onData.bind(this));
}

/**
 */

extend(BaseModel.prototype, Watchable.prototype, {

  /**
   */

  load: function(onLoad) {
    return this._run({ name: "load", query: { id: this.id } }, onLoad);
  },

  /**
   */

  save: function(onSave) {
    return this.id ? this.update(onSave) : this.insert(onSave);
  },

  /**
   */

  insert: function(onInsert) {
    return this._run({ name: "insert", data: this.toJSON() }, onInsert);
  },

  /**
   */

  remove: function(onInsert) {
    return this._run({ name: "remove", query: { id: this.id } }, onInsert);
  },

  /**
   */

  update: function(onInsert) {
    return this._run({ name: "update", data: this.toJSON(), query: { id: this.id } }, onInsert);
  },

  /**
   */

  toJSON: function() {
    var props = {};
    for (var key in this) {
      var v = this[key];
      if (/string|boolean|number/.test(typeof v)) {
        props[key] = v;
      }
    }
    return props;
  },

  /**
   */

  _run: function(operation, next) {
    if (!next) next = function() { };
    this
    .bus(operation)
    .on("data", this._onData.bind(this))
    .once("error", next)
    .once("end", next);
    return this;
  },

  /**
   */

  _onData: function(data) {
    this.setProperties(this.fromData(this.data = data));
  },

  /**
   * deserialize
   */

  fromData: function(data) {
    return data;
  },

  /**
   */

  equals: function(model) {
    return this.id === model.id;
  }
});

/**
 */

module.exports = BaseModel;
