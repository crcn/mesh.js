var sa = require("superagent");

module.exports = function(ops, onRequest) {
  var method = ops.method.toLowerCase();

  var r = sa[{
    "delete": "del"
  }[method] || method](ops.uri);

  if (ops.form) {
    r.type("form");
  }

  if (ops.headers) {
    for (var key in ops.headers) {
      r.set(key, ops.headers[key]);
    }
  }

  if (ops.query) {
    r.query(ops.query);
  }

  if (ops.data) {
    r.send(ops.data);
  }

  r.end(function(err, res) {

    if (err) return onRequest(err);

    res = res.text;

    try {
      res = JSON.parse(res);
    } catch (e) { }

    onRequest(void 0, res);
  });
};
