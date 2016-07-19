var Bus = require('./base');
var Response = require('../response');
var EmptyResponse = require('../response/empty');

/**
 */

function RaceBus(busses) {
  this._busses = busses;
}

/**
 */

Bus.extend(RaceBus, {

  /**
   */

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {
      var busses  = self._busses.concat();
      var numLeft = busses.length;
      var found   = -1;
      busses.forEach(function forEach(bus, i) {
        var response = bus.execute(action) || EmptyResponse.create();
        response.pipeTo({
          write: function write(value) {
            if ((~found && found !== i)) return;
            found = i;
            writable.write(value);
          },
          close: function close() {
            if ((~found && found === i) || (--numLeft) === 0) {
              writable.close();
            }
          },
          abort: writable.abort.bind(writable)
        });
      });
    });
  }
});

/**
*/

module.exports =  RaceBus;
