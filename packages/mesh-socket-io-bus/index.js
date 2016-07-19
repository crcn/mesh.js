var io     = require('socket.io-client');
var RemoteBus    = require('mesh-remote-bus');
var mesh   = require('mesh');
var Bus    = mesh.Bus;
var NoopBus = mesh.NoopBus;

function SocketIoBus(options, bus) {

  if (!bus) bus = NoopBus.create();

  if (!options) options = {};
  if (typeof options === 'string') {
    options = { channel: options };
  }

  var client  = options.client  || options.connection || io(options.host);
  var channel = options.channel || 'o';
  var pack    = options.pack    || function(msg) { return msg; };
  var unpack  = options.unpack  || function(msg) { return msg; };

  if (!options.host && typeof window !== 'undefined') {
    options.host = location.protocol + '//' + location.host;
  }

  this.options = options;

  client.on('disconnect', function() {
    bus.execute({ action: 'disconnect' });
  });

  this.bus = RemoteBus.create({
    addMessageListener: function(listener) {
      client.on(channel, function(msg) {
        listener(unpack(msg));
      });
    },
    sendMessage: function(msg) {
      client.emit(channel, pack(msg));
    }
  }, bus);
}

Bus.extend(SocketIoBus, {
  execute(action) {
    return this.bus.execute(action);
  }
});

module.exports = SocketIoBus;
