var mesh     = require('mesh');
var Response = mesh.Response;
var Bus      = mesh.Bus;

var _i = 0;

function _createRemoteId() {
  return ++_i;
}

function RemoteBus(adapter, localBus) {
  this._origin         = Math.round(Math.random() * 9999);
  this._localBus       = localBus;
  this._openOperations = {};
  this._adapter        = adapter;

  adapter.addMessageListener(this._handleMessage.bind(this));
}

Bus.extend(RemoteBus, {
  _cleanup(operationId) {
      delete this._openOperations[operationId];
  },
  _handleMessage(message) {
    // message.remote = true;
    var open = this._openOperations[message.resp];

    if (!open) {
      return this._request(message);
    }

    this._response(open, message);
  },
  _request(operation) {

    // if (!operation.req) return;

    var stream = this._localBus.execute(operation);

    // don't wait for a response from the stream if response is
    // already defined.
    if (operation.resp == void 0) {
      stream.pipeTo({
        write: (data) => {
          this._adapter.sendMessage({ type: 'data', resp: operation.req, data: data });
        },
        close: () => {
          this._adapter.sendMessage({ type: 'close', resp: operation.req });
        },
        abort: (err) => {
          this._adapter.sendMessage({ type: 'error', resp: operation.req, data: { message: err.message } });
        }
      });
    }

    return stream;
  },
  _response(open, operation) {
    if (operation.type === 'data') {
      open.writable.write(operation.data);
    } else if (operation.type === 'close') {
      open.writable.close();
    } else if (operation.type === 'error') {
      open.writable.abort(new Error(operation.data.message));
    }
  },
  execute(operation) {
    return Response.create((writable) => {
      operation = Object.assign({}, operation);
      // if the operation is remote, then ignore it
      if (operation.req && operation.origin === this._origin) {
        return writable.close();
      }

      if (!operation.origin) {
        operation.origin = this._origin;
      }

      // user-defined. If response has something, then don't
      // keep it open
      if (operation.resp == void 0) {

        this._openOperations[operation.req = _createRemoteId()] = {
          operation: operation,
          writable: writable
        };

        writable.then(this._cleanup.bind(this, operation.req), this._cleanup.bind(this, operation.req));

      } else {
        writable.close();
      }

      this._adapter.sendMessage(operation);
    });
  }
});

module.exports = RemoteBus;
