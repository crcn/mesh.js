
/**
 * IE8+ compatible subclassing. See https://babeljs.io/docs/advanced/caveats/
 */

export default function (parent, child, ...props) {

  function ctor() {
    this.constructor = child;
  }

  ctor.prototype  = parent.prototype;
  child.prototype = new ctor();

  Object.assign(child.prototype, Object.assign.apply(Object, [{}].concat(props)));

  return child;
}
