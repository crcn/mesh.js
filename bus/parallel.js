var Bus = require('./base');
var Response = require('../response');

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
        var resp = bus.execute(operation);
        resp.pipeTo(writable, { preventClose: true });
        resp.then(() => {
          if (!(--numLeft)) writable.end();
        });
      });
    });
  }
});

/**
 */

module.exports =  ParallelBus;
