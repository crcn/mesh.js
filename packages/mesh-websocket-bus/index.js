import { NoopBus, Response } from 'mesh';
import { EventEmitter } from 'events';
import ws from 'websocket';

var WebSocket = ws.w3cwebsocket;

// TODO - should use remove action helper - see ros.js
export default {
  create: function(host, bus) {
    if (!bus) bus = mesh.noop;

    var ws = new WebSocket(host, 'ws-protocol');

    var _openResponses = {};
    var _waitingOps    = [];
    var _isOpen        = false;
    ws.onerror = function(error) {
    };

    ws.onopen    = function() {
      _isOpen = true;
      _waitingOps.forEach(send);
    }

    ws.onmessage = function(message) {
      var op   = JSON.parse(message.data);
      var resp = _openResponses[op.resp];

      if (!resp) {
        return bus.execute(op);
      }

      if (op.data == void 0) {
        resp.close();
        delete _openResponses[op.resp];
      } else {
        resp.write(op.data);
      }
    }

    function send(action) {
      ws.send(JSON.stringify(action));
    }

    var _i = 0;
    var _mid = Date.now() + '_' + Math.round(Math.random() * 99999) + '_';

    function createId() {
      return _mid + (++_i);
    }

    return {
      execute: function(action) {
        return Response.create(function(writable) {
          if (!action.id) {
            action.id = createId();
          }
          _openResponses[action.id] = writable;

          if (_isOpen) {
            send(action);
          } else {
            _waitingOps.push(action);
          }
        });
      }
    };
  }
}
