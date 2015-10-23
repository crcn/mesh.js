module.exports = function(to) {
  var fromObjects = Array.prototype.slice.call(arguments, 1);
  for (var i = 0, n = fromObjects.length; i < n; i++) {
    var fm = fromObjects[i];
    for (var key in fm) {
      to[key] = fm[key];
    }
  }
  return to;
}
