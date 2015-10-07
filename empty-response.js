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
    return Promise.resolve({
      value: void 0,
      done: true
    });
  }
});

/**
 */

export default EmptyResponse;
