var extend        = require("xtend/mutable");
var _             = require("highland");
var Watchable     = require("./watchable");
var watchProperty = require("./watch-property");

/**
 */

function Collection(properties) {
  Watchable.call(this, properties);
  if (this.data) this._onData(this.data);
  watchProperty(this, "data", this._onData.bind(this));
}

/**
 */

extend(Collection.prototype, Watchable.prototype, {

  /**
   */

  modelClass: require("./model"),

  /**
   */

  createModel: function(properties) {
    return new this.modelClass(extend({ bus: this.bus }, properties));
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
    .once("end", onLoad);
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

      for (var j = csource.length; j--;) {
        var bmodel = csource[j];
        if (amodel.equals(bmodel)) {
          bmodel.setProperties({ data: amodel.toJSON() });
          msource.splice(i, 1, bmodel); // use existing model - resort
          break;
        }
      }
    }

    this.source = msource;

    this._changed();
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
})

module.exports = Collection;
