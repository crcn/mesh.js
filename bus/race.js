var Bus = require('./base');
var Response = require('../response');

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

  execute: function(operation) {
    return Response.create((writable) => {
      var busses  = this._busses.concat();
      var numLeft = busses.length;
      var found   = -1;
      busses.forEach((bus, i) => {
        var response = bus.execute(operation);

        response.pipeTo({
          write: function(value) {
            if ((~found && found !== i)) return;
            found = i;
            writable.write(value);
          },
          close: function() {
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
