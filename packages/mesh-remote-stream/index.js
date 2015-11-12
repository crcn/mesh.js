var mesh    = require("mesh");
var through = require("obj-stream").through;
var extend  = require("xtend/mutable");

/**
 */

module.exports = function(onMessage, emitOperation, localBus) {
  return _createClient(onMessage, emitOperation, localBus);
};


var _i = 0;

function _createRemoteId() {
  return ++_i;
}

/**
 */

function _createClient(onMessage, emitOperation, localBus) {

  var openOperations = {};
  var origin         = Date.now() + "." + (Math.random() * 9999);

  /**
   */

  function _cleanup(operation) {
    delete openOperations[operation.rid];
  }

  /**
   */

  function _request(operation) {

    // if (!operation.req) return;

    var stream = localBus(operation);

    // don't wait for a response from the stream if response is
    // already defined.
    if (operation.resp == void 0) {
      stream.pipe(through(function(data, next) {
        emitOperation(mesh.op("data", { resp: operation.req, data: data }));
        next();
      }, function() {
        emitOperation(mesh.op("end", { resp: operation.req }));
      })).on("error", function(err) {
        emitOperation(mesh.op("error", { resp: operation.req, data: { message: err.message } }));
      });
    }

    return stream;
  }

  /**
   */

  function _response(open, operation) {
    if (operation.name === "data") {
      open.stream.write(operation.data);
    } else if (operation.name === "end") {
      open.stream.end();
    } else if (operation.name === "error") {
      open.stream.emit("error", new Error(operation.data.message));
    }
  }

  /**
   */

  onMessage(function(message) {
    // message.remote = true;
    var open = openOperations[message.resp];

    if (!open) {
      return _request(message);
    }

    _response(open, message);
  });

  /**
   */

  return mesh.stream(function(operation, stream) {
    // if (operation.remote) return stream.end();

    operation = extend({}, operation);

    // if the operation is remote, then ignore it
    if (operation.req && operation.origin === origin) {
      return stream.end();
    }

    if (!operation.origin) {
      operation.origin = origin;
    }

    // user-defined. If response has something, then don't
    // keep it open
    if (operation.resp == void 0) {


      openOperations[operation.req = _createRemoteId()] = {
        operation: operation,
        stream: stream
      };

      stream.once("error", _cleanup.bind(this, operation.req))
      .once("end", _cleanup.bind(this, operation.req));

    } else {
      stream.end();
    }

    emitOperation(operation);
  });
}
