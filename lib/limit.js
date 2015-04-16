var _async = require("./_async");
var stream = require("obj-stream");

module.exports = function(count, bus) {

  var numRunning = 0;
  var queue      = [];

  function dequeue() {
    if (--numRunning < count && !!queue.length) run.apply(void 0, queue.shift());
  }

  function run(operation, writer) {
    numRunning++;
    bus(operation).once("end", dequeue).pipe(writer);
  }

  return function(operation) {
    var writer = stream.writable();

    if (numRunning >= count) {
      queue.push([operation, writer]);
    } else {
      run(operation, writer);
    }

    return writer.reader;
  }
};
