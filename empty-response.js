import Response from "./response";

/**
 */

function EmptyResponse() {
  Response.call(this);
  this._resolve();
}

/**
 */

Object.assign(EmptyResponse.prototype, Response.prototype, {
  read: function() {
    return Promise.resolve(void 0);
  }
});

/**
 */

export default EmptyResponse;
