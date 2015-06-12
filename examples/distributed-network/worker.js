var createWorkerBus = require("./bus/worker");
var id = process.env.ID;

console.log("starting worker %d", id);
var bus = createWorkerBus({

  /**
   * message boundary
   */

  boundary: "|||||",

  /**
   */

  masterPort: process.env.MASTER_PORT,

  /**
   */

  log: function() {
    var args = Array.prototype.slice.call(arguments);
    console.log.apply(console, ["worker %s:", id].concat(args));
  },

  /**
   */

  commands: {

    /**
     * simple ping-pong
     */

    ping: function(operation, next) {
      next(void 0, "worker " + id + " pong");
    },

    /**
     * recursively runs trace until count is 0. Note that
     * the trace operation gets sent back to the server.
     */

    trace: function(operation) {
      console.log("worker %s trace %s %d",id, operation.dist, operation.count || 0);
      if (operation.count) {
        return bus({ name: "trace", dist: operation.dist, count: operation.count - 1 });
      } else {
        return bus({ name: "ping", dist: operation.dist });
      }
    },

    /**
     * sample error handler
     */

    error: function(operation, next) {
      console.log("worker %s return error", id);
      next(new Error(operation.message || "some error"))
    }
  }
});
