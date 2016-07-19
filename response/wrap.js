var Response         = require('./index');
var BufferedResponse = require('./buffered');
var EmptyResponse    = require('./empty');

/**
 */

module.exports =  {
  create: function() {

    var arg1 = arguments[0];

    if (typeof arg1 !== 'undefined') {

      // is it a stream?
      if (arg1.read) return arg1;

      // is it a promise?
      if (arg1.then) {
        return Response.create(function(writable) {
          arg1.then(function resolve(value) {
            if (value != void 0) writable.write(value);
            writable.close();
          }, writable.abort.bind(writable));
        });
      }

      return BufferedResponse.create.apply(
        BufferedResponse,
        [void 0].concat(Array.prototype.slice.call(arguments))
      );
    }

    return EmptyResponse.create();
  }
};
