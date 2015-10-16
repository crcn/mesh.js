var BufferedResponse = require('./buffered');

/**
 */

function ErrorResponse(error) {
  BufferedResponse.call(this, error);
}

/**
 */


BufferedResponse.extend(ErrorResponse);

/**
 */

module.exports =  ErrorResponse;
