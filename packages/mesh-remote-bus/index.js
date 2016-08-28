var mesh     = require('mesh');
var Response = mesh.Response;
var Bus      = mesh.Bus;

var _i = 0;

function _createRemoteId() {
  return ++_i;
}

function RemoteBus(adapter, localBus) {
  this._origin    = Math.round(Math.random() * 9999);
  this._localBus  = localBus;
  this._req       = {};
  this._resp      = {};
  this._adapter   = adapter;

  adapter.addListener(this._handleMessage.bind(this));
}

Bus.extend(RemoteBus, {
  _cleanup(actionId) {
    this._adapter.send({ type: 'cancel', resp: actionId });
    delete this._req[actionId];
  },
  _handleMessage(message) {
    if (message.resp != null) {
      this._response(message);
    } else {
      this._request(message);
    }
  },
  _request(message) {

    // if (!action.req) return;

    if (message.type === 'execute') {

      var stream = this._resp[message.req] = this._localBus.execute(Object.assign({}, message.data, { req: message.req }));

      // don't wait for a response from the stream if response is
      // already defined.
      if (message.resp == void 0) {
        stream.pipeTo({
          write: (data) => {
            this._adapter.send({ type: 'data', resp: message.req, data: data });
          },
          close: () => {
            this._adapter.send({ type: 'close', resp: message.req });
          },
          abort: (err) => {
            this._adapter.send({ type: 'error', resp: message.req, data: { message: err.message } });
          }
        });
      }
    } else if (message.type === 'cancel') {
      this._resp[message.req].cancel();
      this._resp[message.req] = undefined;
    }
  },
  _response(message) {
    var open = this._req[message.resp];
    if (open)
    if (message.type === 'data') {
      open.write(message.data);
    } else if (message.type === 'close') {
      open.close();
    } else if (message.type === 'error') {
      open.abort(new Error(message.data.message));
    }
  },
  execute(action) {
    return Response.create((writable) => {
      action = Object.assign({}, action);
      // if the action is remote, then ignore it
      if (action.req && action.origin === this._origin) {
        return writable.close();
      }

      if (!action.origin) {
        action.origin = this._origin;
      }

      var req = _createRemoteId();

      // user-defined. If response has something, then don't
      // keep it open
      if (action.resp == void 0) {
        this._req[req] = writable;
        writable.then(this._cleanup.bind(this, req), this._cleanup.bind(this, req));

      } else {
        writable.close();
      }

      this._adapter.send({ type: 'execute', data: action, req: req });
    });
  }
});

module.exports = RemoteBus;
