var mesh     = require('mesh');
var Bus      = mesh.Bus;
var Response = mesh.Response;

/**
 */

function TailableBus(bus) {
  this._bus = bus;
  this._tails = [];
}

/**
 */

Bus.extend(TailableBus, {

  /**
   */

  createTail: function(action) {
    return Response.create((writable) => {
      this._tails.push(writable);
      writable.then(() => {
        this._tails.splice(this._tails.indexOf(writable), 1);
      });
    });
  },

  /**
   */

  execute: function(action) {
    var response = this._bus.execute(action);

    response.then(() => {
      this._tails.forEach((tail) => {
        tail.write(action);
      });
    });

    return response;
  }
});

/**
 */

module.exports = TailableBus;
