var PUBNUB   = process.browser ? require("pubnub-browserify") : {};
var sift     = require("sift");
var Writable = require("obj-stream").Writable;
var extend   = require("xtend");

module.exports = function(options, bus) {

  var clientId = Date.now() + "_" + Math.round(Math.random() * 999999999);

  var c = options.subscribe ? options : PUBNUB.init({
    "publish_key"   : options.publishKey,
    "subscribe_key" : options.subscribeKey
  });

  var clients = [];

  if (options.channel) {
    addChannel(options.channel);
  }

  function createStream(action) {
    var stream = new Writable();

    process.nextTick(function() {

      if (action.name === "tail") {
        return tail(stream, action);
      }

      if (!action.remoteClientId) {
        action.remoteClientId = clientId;
        for (var i = clients.length; i--;) {
          clients[i].send(action);
        }
      }

      stream.end();
    });

    return stream.reader;
  }

  function addChannel(channel) {

    c.subscribe({
      channel: channel,
      callback: function(action) {
        if (action.remoteClientId === clientId) return;
        bus(action);
      }
    });

    clients.push({
      send: function(data) {
        c.publish({
          channel: channel,
          message: data
        });
      }
    });
  }

  createStream.addChannel = addChannel;

  return createStream;

  function tail (stream, action) {
    if (action) {
      action = JSON.parse(JSON.stringify(action));
      delete action.name;
    }
    tails.push({
      test: sift(properties ? properties : function() { return true; }),
      stream: stream
    });
  }
};
