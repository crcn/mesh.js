module.exports = function(target, property, listener) {
  var currentValue = target[property];
  target.on("change", function() {
    if (target[property] !== currentValue) {
      return listener(currentValue = target[property]);
    }
  });
}
