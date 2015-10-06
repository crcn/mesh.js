var stream = require("./stream");

module.exports = function(count, errorFilter, bus) {

  if (arguments.length === 2) {
    bus         = errorFilter;
    errorFilter = void 0;
  }

  if (!errorFilter) {
    errorFilter = function(operation, error) {
      return true;
    };
  }

  return stream(function(operation, stream) {

    var retryCountdown = count;

    function run(error) {

      if (error) {
        if (!errorFilter(error) || retryCountdown <= 0) {
          return stream.emit("error", error);
        }
      }

      retryCountdown--;

      bus(operation)
      .on("data", function(data) {
        retryCountdown = 0;
        stream.write(data);
      })
      .on("error", run)
      .on("end", function() {
        stream.end();
      });
    }

    run();
  });
};
