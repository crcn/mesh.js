var Bus = require('./base');
var Response = require('../response');
var EmptyResponse = require('../response/empty');

/**
 */

function FallbackBus(busses) {
  this._busses = busses;
}

/**
 */

 Bus.extend(FallbackBus, {

  /**
   */

  execute: function(action) {
    return Response.create((writable) => {
      var busses = this._busses.concat();
      var next = (i) => {
        if (i === busses.length) return writable.close();
        var response = busses[i].execute(action) || EmptyResponse.create();
        var hasChunk = false;
        response.pipeTo({
          write: function(value) {
            hasChunk = true;
            writable.write(value);
          },
          close: function() {
            if (hasChunk) {
              writable.close();
            } else {
              next(i + 1);
            }
          },
          abort: writable.abort.bind(writable)
        });
      };
      next(0);
    });
  }
});

/**
 */

module.exports =  FallbackBus;
