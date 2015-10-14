
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

  then: function(resolve, reject) {
    return this._promise.then(resolve, reject);
  },

  /**
   * error handler
   */

  catch: function(reject) {
    return this._promise.catch(reject);
  },

  /**
   * read a chunk
   */

  read: function() {
    // OVERRIDE ME
  }
});

/**
 */

Response.create = require('../internal/create-object');
Response.extend = require('../internal/extend');

/**
 */

module.exports =  Response;
