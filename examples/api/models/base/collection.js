var extend        = require("xtend/mutable");
var _             = require("highland");
var Watchable     = require("./watchable");
var watchProperty = require("./watch-property");

/**
 */

function Collection(properties) {
  this.source = [];
  Watchable.call(this, properties);
  if (this.data) this._onData(this.data);
  watchProperty(this, "data", this._onData.bind(this));
  this._spyOnBus();
}

/**
 */

extend(Collection.prototype, Watchable.prototype, {

  /**
   */

  length: 0,

  /**
   */

  modelClass: require("./model"),

  /**
   */

  createModel: function(properties) {
    return new this.modelClass(extend({ bus: this.bus }, properties || {}));
  },

  /**
   */

  find: function(model) {
    for (var i = this.length; i--;) {
      if (this.at(i).equals(model)) return this.at(i);
    }
  },

  /**
   */

  at: function(index) {
    return this.source[index];
  },

  /**
   */

  indexOf: function(item) {
    return this.source.indexOf(item);
  },

  /**
   */

  load: function(onLoad) {
    this
    .bus({ name: "load", multi: true })
    .pipe(_.pipeline(_.collect))
    .on("data", this._onData.bind(this))
    .once("error", onLoad)
    .once("end", onLoad.bind(this, void 0, this));
  },

  /**
   */

  toJSON: function() {
    return this.source.map(function(model) {
      return model.toJSON();
    });
  },

  /**
   */

  _onData: function(data) {
    this._diff(data.map(this.createModel.bind(this)));
  },

  /**
   */

  _diff: function(nsource) {

    var msource = nsource.concat();
    var csource = this.source || [];

    for (var i = nsource.length; i--;) {
      var amodel = nsource[i];

      var emodel = this.find(amodel);
      if (emodel) {
        emodel.setProperties({ data: amodel.toJSON() });
        msource.splice(i, 1, emodel); // use existing model - resort
        break;
      }
    }

    this.source = msource;

    this._changed();
  },

  /**
   * Spies on the bus for operations specific to this collection. We could further
   * customize this spying function to specific features such as pagination.
   */

  _spyOnBus: function() {
    if (!this.bus) return;
    this._spy = this.bus({ name: "spy" }).on("data", this._onSpiedOperation.bind(this));
    // TODO - this.on("dispose", this._spy.dispose.bind(this._spy))
  },

  /**
   */

  _onSpiedOperation: function(operation) {
    if (operation.name === "insert") this._onSpiedInsert(operation);

    // TODO
    // if (operation.name === "update") this._onSpiedUpdate(operation);
    // if (operation.name === "remove") this._onSpiedRemove(operation);
  },

  /**
   */

  _onSpiedInsert: function(operation) {
    operation.stream.on("data", function(data) {
      this.push(this.createModel({ data: data }));
    }.bind(this));
  },

  /**
   */

  _changed: function() {
    this.length = this.source.length;
    this.emit("change");
  }
});

["concat", "join", "lastIndexOf", "pop", "push", "reverse", "shift", "splice", "unshift"].forEach(function(methodName) {
  var fn = Array.prototype[methodName];
  Collection.prototype[methodName] = function() {
    var ret = fn.apply(this.source, arguments);
    this._changed();
    return ret;
  };
});

module.exports = Collection;
