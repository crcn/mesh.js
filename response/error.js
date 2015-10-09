import BufferedResponse from "./buffered";
import extend from "../internal/extend";

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

export default ErrorResponse;
