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

  createTail: function(operation) {
    return Response.create((writable) => {
      this._tails.push(writable);
      writable.then(() => {
        this._tails.splice(this._tails.indexOf(writable), 1);
      });
    });
  },

  /**
   */

  execute: function(operation) {
    var response = this._bus.execute(operation);

    response.then(() => {
      this._tails.forEach((tail) => {
        tail.write(operation);
      });
    });

    return response;
  }
});

/**
 */

module.exports = TailableBus;
