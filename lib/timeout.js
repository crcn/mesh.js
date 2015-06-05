var stream = require("./stream");

module.exports = function(ms, bus) {
  return stream(function(operation, response) {

    bus(operation).pipe(response);

    var timer = setTimeout(function() {
      response.emit("error", new Error("timeout"));
    }, ms);

    function clearTimer() {
      if (timer) clearTimeout(timer);
      timer = void 0;
    }

    response.once("data", clearTimer);
    response.once("end", clearTimer);
  });
};
