var Response = require('./index');

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

Response.extend(BufferedResponse);

/**
 */

module.exports =  BufferedResponse;
