var extend = require("xtend/mutable");

/**
 */

function Base(properties) {
  extend(this, properties || {});
}

/**
 */

extend(Base.prototype, {
  update: function() {
    // do stuff
  }
});

/**
 */

Base.extend = function(child) {
  var mixins = Array.prototype.slice.call(arguments, 1);

  function ctor() {
    this.constructor = child;
  }

  ctor.prototype  = this.prototype;
  child.prototype = new ctor();

  extend.apply(void 0, [child.prototype].concat(mixins));
  child.extend = Base.extend;
  return child;
}

/**
 */

module.exports = Base;
