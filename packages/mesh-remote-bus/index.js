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
  this._openactions = {};
  this._adapter        = adapter;

  adapter.addListener(this._handleMessage.bind(this));
}

Bus.extend(RemoteBus, {
  _cleanup(actionId) {
      delete this._openactions[actionId];
  },
  _handleMessage(message) {
    // message.remote = true;
    var open = this._openactions[message.resp];

    if (!open) {
      return this._request(message);
    }

    this._response(open, message);
  },
  _request(action) {

    // if (!action.req) return;

    var stream = this._localBus.execute(action);

    // don't wait for a response from the stream if response is
    // already defined.
    if (action.resp == void 0) {
      stream.pipeTo({
        write: (data) => {
          this._adapter.send({ type: 'data', resp: action.req, data: data });
        },
        close: () => {
          this._adapter.send({ type: 'close', resp: action.req });
        },
        abort: (err) => {
          this._adapter.send({ type: 'error', resp: action.req, data: { message: err.message } });
        }
      });
    }

    return stream;
  },
  _response(open, action) {
    if (action.type === 'data') {
      open.writable.write(action.data);
    } else if (action.type === 'close') {
      open.writable.close();
    } else if (action.type === 'error') {
      open.writable.abort(new Error(action.data.message));
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

      // user-defined. If response has something, then don't
      // keep it open
      if (action.resp == void 0) {

        this._openactions[action.req = _createRemoteId()] = {
          action: action,
          writable: writable
        };

        writable.then(this._cleanup.bind(this, action.req), this._cleanup.bind(this, action.req));

      } else {
        writable.close();
      }

      this._adapter.send(action);
    });
  }
});

module.exports = RemoteBus;
