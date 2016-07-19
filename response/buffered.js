var Response = require('./index');
var isArray  = require('../internal/is-array');

/**
 */

function BufferedResponse(error, chunkValues) {
  Response.call(this, function createWritable(writable) {
    if (error) writable.abort(error);
    chunkValues = isArray(chunkValues) ? chunkValues : chunkValues != void 0 ? [chunkValues] : [];
    chunkValues.forEach(writable.write.bind(writable));
    writable.close();
  });
}

/**
 */

Response.extend(BufferedResponse);

/**
 */

module.exports =  BufferedResponse;
