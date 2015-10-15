var Response = require('./base');
var extend = require('../internal/extend');
var Chunk = require('../internal/chunk');
var WritableStream = require('../stream/writable');

/**
 * Creates a new Streamed response
 */

function AsyncResponse(run) {
  Response.call(this);

  var writer   = new WritableStream();
  writer.then(this._resolve, this._reject);
  this._reader = writer.getReader();

  // todo - pass writable instead
  if (run) {
    // var ret = run(this._writable);
    var ret = run(writer);

    // thenable? Automatically end
    if (ret && ret.then) {
      ret.then(() => {
        writer.end();
      }, writer.abort.bind(writer));
    }
  }
}

/**
 */

extend(Response, AsyncResponse, {

  /**
   */

  read: function() {
    return this._reader.read();
  }
});

/**
 */

module.exports =  AsyncResponse;
