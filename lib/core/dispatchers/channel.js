"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var remote_1 = require("./remote");
var noop_1 = require("./noop");
var messages_1 = require("../messages");
var streams_1 = require("../streams");
/*

const cb = new CallbackDispatcher((bus) => {
  return new DuplexStream((input, output) {
    return new ChannelBus(input, output, new CallbackDispatcher((message) => "blarg"));
  });
});

const channel = ChannelBus.createFromStream(bus.dispatch())

const stream = channel.dispatch()
*/
// TODO - remove "family" parameter. Doesn't fit this class since
// "family" implies that the we're communicating with another remote application. 
var ChannelBus = (function () {
    function ChannelBus(family, input, output, localBus, _onClose) {
        if (localBus === void 0) { localBus = noop_1.noopDispatcherInstance; }
        this._onClose = _onClose;
        var writer = this._writer = output.getWriter();
        this._remoteBus = new remote_1.RemoteBus({
            testMessage: family && messages_1.filterFamilyMessage,
            family: family,
            adapter: {
                send: function (message) {
                    writer.write(message);
                },
                addListener: function (listener) {
                    input.pipeTo(new streams_1.WritableStream({
                        write: function (message) {
                            listener(message);
                        },
                        close: _onClose,
                        abort: _onClose
                    }));
                }
            }
        }, localBus);
    }
    ChannelBus.prototype.dispose = function () {
        this._writer.close();
    };
    ChannelBus.prototype.dispatch = function (message) {
        return this._remoteBus.dispatch(message);
    };
    ChannelBus.createFromStream = function (family, stream, localBus) {
        return new ChannelBus(family, stream.readable, stream.writable, localBus);
    };
    return ChannelBus;
}());
exports.ChannelBus = ChannelBus;
//# sourceMappingURL=channel.js.map