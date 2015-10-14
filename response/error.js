var BufferedResponse = require('./buffered');
var extend = require('../internal/extend');

/**
 */

function ErrorResponse(error) {
  BufferedResponse.call(this, error);
}

/**
 */


extend(BufferedResponse, ErrorResponse);

/**
 */

module.exports =  ErrorResponse;
