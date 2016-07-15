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

  this.method = options.method || function(action) {
    return {
      "insert" : "post",
      "update" : "put",
      "upsert" : action.data && action.data[action.idProperty] ? "put" : "post",
      "load"   : "get",
      "remove" : "del"
    }[action.name];
  };

  this.url    = function(action) {

    var cpath = "/" + action.collection;
    var mpath = action.data ? cpath + "/" + action.data[action.idProperty] : "";

    return {
      "insert" : cpath,
      "update" : mpath,
      "upsert" : action.data && action.data[action.idProperty] ? mpath : cpath,
      "load"   : action.multi ? cpath : mpath,
      "remove" : mpath
    }[action.name];
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
  run: function(action, next) {

    var options = action = extend({}, this.options, action.http, action);

    var method = options.method || this.method(action) || "GET";

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
      headers = headers.call(this, action);
    }

    var query = options.query;
    if (typeof query === "function") {
      query = query(action);
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

  return mesh.stream(function(action, stream) {
    var self = this;
    db.run(action, function(err, data) {
      if (err) {
        return stream.emit("error", err);
      }
      _toArray(data).forEach(stream.write.bind(stream));
      stream.end();
    });
  });
};
