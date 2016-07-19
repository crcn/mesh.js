var WritableStream = require('../stream/writable');
var extend         = require('../internal/extend');

/**
 * Creates a new Streamed response
 */

function Response(run) {

  var writer   = this._writer = WritableStream.create();
  this._reader = writer.getReader();

  // todo - pass writable instead
  if (run) {
    // var ret = run(this._writable);
    var ret = run(writer);

    // thenable? Automatically end
    if (ret && ret.then) {
      ret.then(function () {
        writer.close();
      }, writer.abort.bind(writer));
    }
  }
}

/**
 */

extend(Response, {

  /**
   */

  then: function (resolve, reject) {
    return this._writer.then(resolve, reject);
  },

  /**
   */

  catch: function (reject) {
    return this._writer.catch(reject);
  },

  /**
   */

  read: function () {
    return this._reader.read();
  },

  /**
   */

  readAll: function () {
    var self = this;
    var buffer = [];
    // return new
    return new Promise(function run(resolve, reject) {
      self.pipeTo({
        write: buffer.push.bind(buffer),
        close: resolve.bind(self, buffer),
        abort: reject
      });
    });
  },

  /**
   */

  pipeTo: function (writable, options) {
    return this._reader.pipeTo(writable, options);
  },

  /**
   */

  cancel: function () {
    return this._reader.cancel();
  }
});

/**
 */

Response.create = require('../internal/create-object');
Response.extend = extend;

/**
 */

module.exports =  Response;
