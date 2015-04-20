
function _equals(a, b) {

  var toa = typeof a;
  var tob = typeof b;

  if (toa !== tob) return false;

  if (toa === "object") {
    for (var k in a) {
      if (!_equals(a[k], b[k])) return false;
    }

    return true;
  }

  return a === b;
}

module.exports = _equals;
