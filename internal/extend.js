
/**
 * IE8+ compatible subclassing. See https://babeljs.io/docs/advanced/caveats/
 */

module.exports =  function (parent, child) {

  var props;

  if (typeof child === 'function') {
    props = Array.prototype.slice.call(arguments, 2);
  } else {
    child  = parent;
    parent = Object;
    props  = Array.prototype.slice.call(arguments, 1);
  }

  function ctor() {
    this.constructor = child;
  }

  Object.assign(child, parent); // copy static props

  ctor.prototype  = parent.prototype;
  child.prototype = new ctor();

  Object.assign(child.prototype, Object.assign.apply(Object, [{}].concat(props)));

  return child;
}
