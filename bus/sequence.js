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

  execute: function (action) {
    var self = this;
    return Response.create(function createWritable(writable) {

      // copy incase the collection mutates (unlikely but possible)
      var busses = self._busses.concat();
      var currentResponse;

      function next(i) {
        if (i === busses.length) return writable.close();
        var resp = currentResponse = busses[i].execute(action) || EmptyResponse.create();
        resp.pipeTo({
          write: writable.write.bind(writable),
          close: next.bind(self, i + 1),
          abort: writable.abort.bind(writable)
        });
      }

      function cancel() {
        if (currentResponse) currentResponse.cancel();
      }

      writable.then(cancel, cancel);
      next(0);
    });
  }
});

/**
 */

module.exports = SequenceBus;
