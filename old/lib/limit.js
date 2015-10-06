var stream = require("./stream");

module.exports = function(count, bus) {

  var numRunning = 0;
  var queue      = [];

  function dequeue() {
    if (--numRunning < count && !!queue.length) run.apply(void 0, queue.shift());
  }

  function run(operation, writer) {
    numRunning++;
    bus(operation).once("error", dequeue).once("end", dequeue).pipe(writer);
  }

  return stream(function(operation, writer) {
    if (numRunning >= count) {
      queue.push([operation, writer]);
    } else {
      run(operation, writer);
    }
  });
};
