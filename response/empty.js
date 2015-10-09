import Response from "./base";
import extend from "../internal/extend";

/**
 */

function EmptyResponse() {
  Response.call(this);
  this._resolve();
}

/**
 */


extend(Response, EmptyResponse, {
  read: function() {
    return Promise.resolve({
      value : void 0,
      done  : true
    });
  }
});

/**
 */

export default EmptyResponse;
