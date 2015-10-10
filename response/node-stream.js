import AsyncResponse from "./async";
import extend from "../internal/extend";

/**
 */

function NodeStreamResponse(stream) {
  this.__stream = stream;
}

/**
 */

extend(AsyncResponse, NodeStreamResponse, {

});

/**
 */

export default NodeStreamResponse;
