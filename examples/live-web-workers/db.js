var cluster = require("fourk")();
var mesh    = require("../..");
var stream  = require("obj-stream");
var loki    = require("mesh-loki");

if (cluster.isMaster) {

  var child = cluster.fork();
  var _i    = 0;

  module.exports = function(op) {

    var writable = stream.writable();
    op._id       = _i++;

    function onMessage(name, payload) {
      if (payload._id == op._id) {
        if (name === "data") {
          writable.write(payload.data);
        } else if (name === "end") {
          child.removeListener("message", onMessage);
          writable.end();
        }
      }
    }

    child.on("message", onMessage);

    child.emit("operation", op);

    return writable.reader;
  }
} else {
  var db = mesh.tailable(loki());

  cluster.on("operation", function(operation) {
    mesh.open(db).on("data", function(data) {
      cluster.emit("data", { data: data, _id: operation._id });
    }).on("end", function() {
      cluster.emit("end", { _id: operation._id });
    }).end(operation);

  });
}
