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

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {

      var busses  = self._busses.concat();
      var numLeft = busses.length;

      if (!numLeft) return EmptyResponse.create();

      busses.forEach(function forEach(bus) {
        var resp = bus.execute(action) || EmptyResponse.create();
        resp.pipeTo({
          write: writable.write.bind(writable),
          close: function close() {
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
