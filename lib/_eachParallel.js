module.exports = function(items, each, complete) {
  var i = 0;
  var completed = false;

  function done() {
    if (completed) return;
    return complete.apply(this, arguments);
  }

  items.forEach(function(item) {
    each(item, function(err, item) {
      if (err) return done(err);
      if (++i == items.length) return done();
    });
  });
};
