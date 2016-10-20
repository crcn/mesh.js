var mesh     = require('mesh');
var Response = mesh.Response;
var Bus      = mesh.Bus;

var _i = 0;

function _createRemoteId() {
  return ++_i;
}

function RemoteBus(adapter, localBus, serializer) {
  this._origin    = Math.round(Math.random() * 9999);
  this._localBus  = localBus;
  this._req       = {};
  this._resp      = {};
  this._adapter   = adapter;
  this._serializer = serializer || {
    serialize: function(action) {
      return Object.assign({}, action);
    },
    deserialize: function(action) {
      return Object.assign({}, action);
    }
  }

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

    if (message.type === 'execute') {

      var action     = this._serializer.deserialize(message.data);
      action.$req    = message.req;
      action.$origin = message.origin;

      var stream = this._resp[message.req] = this._localBus.execute(action);

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
      // if the action is remote, then ignore it
      if (action.$req && action.$origin === this._origin) {
        return writable.close();
      }

      var req = _createRemoteId();
      this._req[req] = writable;

      const serializedAction = this._serializer.serialize(action);

      this._adapter.send({
        type: 'execute',
        data: this._serializer.serialize(action),
        req: req,
        origin: action.$origin || this._origin
      });
    });
  }
});

module.exports = RemoteBus;
