var through = require("through2");
var Peer    = require("peerjs");
var sift    = require("sift");

module.exports = function(options) {

  var peer = new Peer(options);

  var listeners = [];
  var connections = [];

  peer.on("connection", function (c) {
    connections.push(c);
    c.on("data", function(remoteactionStr) {
      var remoteaction = JSON.parse(remoteactionStr);
      remoteaction.remote = true;
      for (var i = listeners.length; i--;) {
        var listener = listeners[i];
        if (listener.test(remoteaction)) {
          listener.stream.push(remoteaction);
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
    return through.obj(function(action, enc, next) {

      if (action.name === "tail") {
        return tail(this, action);
      }

      if (!action.remote && /insert|update|remove/.test(action.name)) {
        for (var i = connections.length; i--;) {
          connections[i].send(JSON.stringify(action));
        }
      }

      next();
    });
  };

  createStream.peer = peer;

  return createStream;

  function tail (stream, action) {
    var op = JSON.parse(JSON.stringify(action));
    delete op.name;

    listeners.push({
      test: sift(op),
      stream: stream
    });
  }
};
