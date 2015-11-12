This bus is an adapter for remote protocols such as socket.io, websockets, pubnub, and more. 

Bus example:

```javascript
import RemoteBus from 'mesh-remote-bus';
import { WrapBus } from 'mesh';
import { EventEmitter } from 'events';

var remote = new EventEmitter();

var adapter = {
  addMessageListener: function(listener) {
    remote.on('message', listener);
  },
  sendMessage: function(message) {
    remote.emit('message', message);
  }
};

var localBus = WrapBus.create(function() {
  return 'hello!';
});

var bus = RemoteBus.create(adapter, localBus);

bus.execute({ }).read().then(function({value}) {
  console.log(value);
})
```
