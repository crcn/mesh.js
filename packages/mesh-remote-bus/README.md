This is an adapter bus for remote protocols such as socket.io, websockets, pubnub, etc.

**Installation**: `npm install mesh-remote-bus`

Example:

```javascript
import RemoteBus from 'mesh-remote-bus';
import { WrapBus } from 'mesh';
import createSocketIoClient from 'socket.io-client';

var client = createSocketIo('http://12.0.0.1:8080');

var adapter = {
  addListener(listener) {
    client.on('message', listener);
  },
  send(message) {
    client.send('message', message);
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
