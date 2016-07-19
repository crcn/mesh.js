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

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {
      var busses = self._busses.concat();
      function next(i) {
        if (i === busses.length) return writable.close();
        var response = busses[i].execute(action) || EmptyResponse.create();
        var hasChunk = false;
        response.pipeTo({
          write: function write(value) {
            hasChunk = true;
            writable.write(value);
          },
          close: function close() {
            if (hasChunk) {
              writable.close();
            } else {
              next(i + 1);
            }
          },
          abort: writable.abort.bind(writable)
        });
      }
      next(0);
    });
  }
});

/**
 */

module.exports =  FallbackBus;
