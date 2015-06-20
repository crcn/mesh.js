var mesh = require("../..");

module.exports = function(options) {

  var db = {};

  function _find(operation) {
    var query = operation.query || {};
    var found = _collection(operation).filter(function(data) {
      for (var key in query) {
        if (data[key] !== query[key]) return false;
      }
      return true;
    });
    return operation.multi ? found : _toArray(found.shift());
  }

  function _collection(operation) {
    return db[operation.collection] || (db[operation.collection] = []);
  }

  function _toArray(value) {
    if (value == void 0) return [];
    return Object.prototype.toString.call(value) === "[object Array]" ? value : [value];
  }

  function _return(data, stream) {
    _toArray(data).forEach(function(data) {
      stream.write(data);
    });
    stream.end();
  }

  var handlers = {
    insert: function(operation, stream) {
      var c = _collection(operation);
      c.push.apply(c, _toArray(operation.data));
      _return(operation.data, stream);
    },
    update: function(operation, stream) {
      var results = _find(operation);
      results.forEach(function(data) {
        for (var key in operation.data) {
          data[key] = operation.data[key];
        }
      });
      stream.end();
    },
    remove: function(operation, stream) {
      var c = _collection(operation);
      _find(operation).forEach(function(data) {
        c.splice(c.indexOf(data), 1);
      });
      stream.end();
    },
    load: function(operation, stream) {
      _return(_find(operation), stream);
    }
  };

  return mesh.stream(function(operation, stream) {
    var handler = handlers[operation.name];
    if (!handler) return stream.end();
    handler(operation, stream);
  });
};
