var extend = require('../internal/extend');
var Chunk = require('../internal/chunk');
var WritableStream = require('../stream/writable');

/**
 * Creates a new Streamed response
 */

function Response(run) {

  var writer   = this._writer = new WritableStream();
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

extend(Response, {

  /**
   */

  then: function(resolve, reject) {
    return this._writer.then(resolve, reject);
  },

  /**
   */

  catch: function(reject) {
    return this._writer.catch(reject);
  },

  /**
   */

  read: function() {
    return this._reader.read();
  }
});

/**
 */

Response.create = require('../internal/create-object');
Response.extend = extend;

/**
 */

module.exports =  Response;
