
/**
 * impl should be close to this: https://streams.spec.whatwg.org/
 */

function Response() {
  this._promise = new Promise((resolve, reject) => {
    this._resolve = resolve;
    this._reject  = reject;
  });
}

/**
 */

Object.assign(Response.prototype, {

  /**
   * Called when the response has ended - Makes Response a thenable i.e: this works
   * yield { then: function() { }}
   */

  then: function(callback) {
    return this._promise.then(callback);
  },

  /**
   * error handler
   */

  catch: function(error) {

  },

  /**
   * read a chunk
   */

  read: function() {

  }
});

/**
 */

export default Response;
