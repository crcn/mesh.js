var through = require("through2");
var Peer    = require("peerjs");
var sift    = require("sift");

module.exports = function(options) {

  var peer = new Peer(options);

  var listeners = [];
  var connections = [];

  peer.on("connection", function (c) {
    connections.push(c);
    c.on("data", function(remoteOperationStr) {
      var remoteOperation = JSON.parse(remoteOperationStr);
      remoteOperation.remote = true;
      for (var i = listeners.length; i--;) {
        var listener = listeners[i];
        if (listener.test(remoteOperation)) {
          listener.stream.push(remoteOperation);
        }
      }
    });
  });

  peer.on("open", function(id) {
    console.log("open", id);
  });

  peer.on("error", function(error) {
    console.log("error", error);
  });

  function createStream() {
    return through.obj(function(operation, enc, next) {

      if (operation.name === "tail") {
        return tail(this, operation);
      }

      if (!operation.remote && /insert|update|remove/.test(operation.name)) {
        for (var i = connections.length; i--;) {
          connections[i].send(JSON.stringify(operation));
        }
      }

      next();
    });
  };

  createStream.peer = peer;

  return createStream;

  function tail (stream, operation) {
    var op = JSON.parse(JSON.stringify(operation));
    delete op.name;

    listeners.push({
      test: sift(op),
      stream: stream
    });
  }
};
