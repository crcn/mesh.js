var Bus = require('./base');
var Response = require('../response');
var EmptyResponse = require('../response/empty');

/**
 */

function SequenceBus(busses) {
  this._busses = busses;
}

/**
 */

Bus.extend(SequenceBus, {

  /**
   */

  execute: function(operation) {
    return Response.create((writable) => {

      // copy incase the collection mutates (unlikely but possible)
      var busses = this._busses.concat();

      var next = (i) => {
        if (i === busses.length) return writable.close();
        var resp = busses[i].execute(operation) || EmptyResponse.create();
        resp.pipeTo(writable, { preventClose: true });
        resp.then(() => next(i + 1));
      };

      next(0);
    });
  }
});

/**
 */

module.exports = SequenceBus;
