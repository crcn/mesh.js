var Chunk = require('../internal/chunk');
var extend = require('../internal/extend');
var Response = require('./base');

/**
 */

function BufferedResponse(error, chunkValues) {
  Response.call(this, function(writable) {
    if (error) writable.abort(error);
    chunkValues = Array.isArray(chunkValues) ? chunkValues : chunkValues != void 0 ? [chunkValues] : [];
    chunkValues.forEach(writable.write.bind(writable));
    writable.end();
  });
}

/**
 */

extend(Response, BufferedResponse);

/**
 */

module.exports =  BufferedResponse;
