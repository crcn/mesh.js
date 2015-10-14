var BufferedResponse = require('./buffered');
var extend = require('../internal/extend');

/**
 */

function EmptyResponse() {
  BufferedResponse.call(this);
}

/**
 */

extend(BufferedResponse, EmptyResponse);

/**
 */

module.exports =  EmptyResponse;
