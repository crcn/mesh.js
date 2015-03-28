var Operation = require("./operation");
var Stream    = require("stream").Stream;

/**
 */

module.exports = function (target) {
  return function (operationOrName, properties) {
    var operation;
    var dstream = target();

    if (!arguments.length) {
      return dstream;
    }

    if (operationOrName instanceof Operation) {
      operation = operationOrName;
    } else {
      operation = new Operation(operationOrName, properties);
    }

    var stream = new Stream();
    stream.readable = stream.writable = true;

    process.nextTick(function() {
      stream.emit("data", operation);
      stream.emit("end");
    });

    return stream.pipe(dstream);
  }
};
