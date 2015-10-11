
/**
 * IE8+ compatible subclassing. See https://babeljs.io/docs/advanced/caveats/
 */

module.exports =  function (parent, child) {
  var props = Array.prototype.slice.call(arguments, 2);

  function ctor() {
    this.constructor = child;
  }

  ctor.prototype  = parent.prototype;
  child.prototype = new ctor();

  Object.assign(child.prototype, Object.assign.apply(Object, [{}].concat(props)));

  return child;
}
