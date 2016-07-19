module.exports = function(items, each) {
  return new Promise(function(resolve, reject) {
    var n = items.length;
    if (!n) return resolve();
    items.forEach(function(item) {
      each(item).then(function() {
        if (!--n) resolve();
      }, reject);
    });
  });
}