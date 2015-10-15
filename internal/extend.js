
/**
 * IE8+ compatible subclassing. See https://babeljs.io/docs/advanced/caveats/
 */

module.exports =  function (parent, child) {

  var props;
  var pi;

  var c = child;
  var p = parent;

  if (typeof c === 'function') {
    pi = 2;
  } else {
    if (typeof p === 'object') {
      c = function() { }
      pi = 0;
    } else {
      c = p || function() { };
      pi = 1;
    }

    p = typeof this === 'function' ? this : Object;
  }

  props = Array.prototype.slice.call(arguments, pi);

  function ctor() {
    this.constructor = c;
  }

  Object.assign(c, p); // copy static props

  ctor.prototype  = p.prototype;
  c.prototype = new ctor();

  Object.assign(c.prototype, Object.assign.apply(Object, [{}].concat(props)));

  return c;
}
