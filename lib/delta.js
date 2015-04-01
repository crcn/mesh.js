var through = require("obj-stream").through;

module.exports = function() {
  var prev = {};
  return through(function(data, next) {
    var delta = {};

    for (var key in data) {
      if (data[key] !== prev[key]) {
        delta[key] = prev[key] = data[key];
      }
    }

    if (Object.keys(delta).length) {
      this.push(delta);
    }

    next();
  });
};
