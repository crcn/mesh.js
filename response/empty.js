import BufferedResponse from "./buffered";
import extend from "../internal/extend";

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

export default EmptyResponse;
