var BufferedResponse = require('./buffered');
var extend = require('../internal/extend');

/**
 */

function EmptyResponse() {
  BufferedResponse.call(this);
}

/**
 */

BufferedResponse.extend(EmptyResponse);

/**
 */

module.exports =  EmptyResponse;
