var request = require("./request");
var extend  = require("xtend/mutable");
var mesh    = require("mesh");

/**
 */

var HTTPDatabase = function(options) {
  if (!options) options = {};

  this.options    = options;
  this.request    = options.request    || request;
  this.idProperty = options.idProperty = options.idProperty || "uid";
  this.prefix     = options.prefix     || "";

  this.method = options.method || function(operation) {
    return {
      "insert" : "post",
      "update" : "put",
      "upsert" : operation.data && operation.data[operation.idProperty] ? "put" : "post",
      "load"   : "get",
      "remove" : "del"
    }[operation.name];
  };

  this.url    = function(operation) {

    var cpath = "/" + operation.collection;
    var mpath = operation.data ? cpath + "/" + operation.data[operation.idProperty] : "";

    return {
      "insert" : cpath,
      "update" : mpath,
      "upsert" : operation.data && operation.data[operation.idProperty] ? mpath : cpath,
      "load"   : operation.multi ? cpath : mpath,
      "remove" : mpath
    }[operation.name];
  };
};

/**
 */

var _getters = {};

/**
 */

function _get(target, keypath) {
  var getter = _getters[keypath];
  if (!getter) {
    getter = _getters[keypath] = new Function("target", "return target." + keypath);
  }
  try {
    return getter(target);
  } catch (e) { }
}

/**
 */

extend(HTTPDatabase.prototype, {
  run: function(operation, next) {

    var options = operation = extend({}, this.options, operation.http, operation);

    var method = options.method || this.method(operation) || "GET";

    if (typeof method === "function") {
      method = method(options);
    }

    if (!method) {
      return next();
    }

    var url = options.url || this.url;

    if (typeof url === "function") {
      url = url.call(this, options);
    }

    var transform = options.transform || function(data) {
      return data;
    };

    var headers = options.headers;
    if (typeof headers === "function") {
      headers = headers.call(this, operation);
    }

    var query = options.query;
    if (typeof query === "function") {
      query = query(operation);
    }

    url = (options.prefix || this.prefix) + url;

    if (!~url.indexOf("://") && process.browser) {
      url = location.protocol + "//" + location.host + url;
    }

    var ops = {
      uri: url,
      query: query,
      method: method,
      headers: headers,
      form: options.form,
      data: options.data
    };

    this.request(ops, function(err, body) {
      if (err) return next(err);
      next(null, transform(body));
    });
  }
});

/**
 */

function _toArray(data) {
  if (data == void 0) return [];
  return Object.prototype.toString.call(data) === "[object Array]" ? data : [data];
}

/**
 */

module.exports = function(options) {

  var db = new HTTPDatabase(options);

  return mesh.stream(function(operation, stream) {
    var self = this;
    db.run(operation, function(err, data) {
      if (err) {
        return stream.emit("error", err);
      }
      _toArray(data).forEach(stream.write.bind(stream));
      stream.end();
    });
  });
};
