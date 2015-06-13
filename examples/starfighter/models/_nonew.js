module.exports = function(clazz) {

  function ctor(properties) {
    if (!(this instanceof ctor)) return new ctor(properties);
    clazz.call(this, properties);
  }

  return clazz.extend(ctor);
}
