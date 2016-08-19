var Bus = require('./base');
var Response = require('../response');

function LimitBus(max, bus) {
  this.max = max;
  this.bus = bus;
  this._queue = [];
  this._running = 0;
}

Bus.extend(LimitBus, {
  execute: function (action) {
    var self = this;
    return new Response(function(writable) {
      if (self._running >= self.max) {
        return self._queue.push({
          action   : action,
          writable : writable
        });
      }

      self._running++;

      function complete() {
        self._running--;
        if (self._queue.length) {
          var item = self._queue.shift();
          self.execute(item.action).pipeTo(item.writable);
        }
      }

      self.bus.execute(action).pipeTo({
        write: writable.write.bind(writable),
        close: function() {
          writable.close();
          complete();
        },
        abort: function(reason) {
          writable.abort(reason);
          complete();
        }
      });
    });
  }
});

module.exports = LimitBus;