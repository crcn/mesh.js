var Bus = require('./base');
var Response = require('../response');
var EmptyResponse = require('../response/empty');

/**
 */

function ParallelBus(busses) {
  this._busses = busses;
}

/**
 */

Bus.extend(ParallelBus, {

  /**
   */

  execute: function(operation) {
    return Response.create((writable) => {

      var busses  = this._busses.concat();
      var numLeft = busses.length;

      busses.forEach((bus) => {
        var resp = bus.execute(operation) || EmptyResponse.create();
        resp.pipeTo({
          write: writable.write.bind(writable),
          close: function() {
            if (!(--numLeft)) writable.close();
          },
          abort: writable.abort.bind(writable)
        });
      });
    });
  }
});

/**
 */

module.exports =  ParallelBus;
