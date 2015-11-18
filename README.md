
<p align="center">
  <img width="300px" style="margin:0px auto" src="https://cloud.githubusercontent.com/assets/757408/11253633/a825c1c8-8df1-11e5-972d-e9256d9b2e13.png">
</p>

<p align="center">
[![Build Status](https://travis-ci.org/crcn/mesh.js.svg)](https://travis-ci.org/crcn/mesh.js) [![Coverage Status](https://coveralls.io/repos/crcn/mesh.js/badge.svg?branch=master&service=github)](https://coveralls.io/github/crcn/mesh.js?branch=master) [![Join the chat at https://gitter.im/crcn/mesh.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/crcn/mesh.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
</p>

Mesh is a utility library that makes it easy to rangle sophisticated data flows. Easily connect things together such as [mongodb](https://www.mongodb.org/), [pubnub](http://pubnub.com/), [socket.io](http://socket.io/) `webrtc` and more to build powerful features such as rollbacks, offline-mode, and realtime data.

Here's a basic example:

```javascript
import LocalStorageDsBus from 'mesh-local-storage-ds-bus';
import SocketIoBus from 'mesh-socket-io-bus';
import { ParallelBus } from 'mesh';

// var mongoBus = MongoDsBus.create();
var storageBus = LocalStorageDsBus.create();

// persist all operations to socket.io & any operations from socket.io
// back to local storage.
var mainBus = ParallelBus.create([
  storageBus,
  SocketIoBus.create({ channel: "operations" }, storageBus)
]);

// insert data. Persists to local storage, and gets
// broadcasted to all connected clients.
mainBus.execute({
  action : "insert",
  collection : "messages"
  data : { text: "hello world" }
}).readAll().then(function() {
  // handle response
});
```

#### Installation

[NPM](https://www.npmjs.com/): `npm install mesh` <br />
[Bower](http://bower.io/): `bower install mesh`

#### Resources

- [Documentation](https://github.com/crcn/mesh.js/tree/master/docs)
- [Examples](./examples)
- Modules
    - Data Store Adapters
      - [in-memory data store bus](./packages/mesh-memory-ds-bus)
      - [mongodb bus](./packages/mesh-mongo-ds-bus)
      - [lokijs bus](./packages/mesh-loki-ds-bus) - lokijs in-memory adapter
      - [local storate bus](./packages/mesh-local-storage-ds-bus) - local storage DS adapter
      - [array bus](./packages/mesh-collection-bus) - persist DS operations to an array collection
    - Realtime Protocol Adapters
      - [socket.io bus](./packages/mesh-socket-io-bus)
      - [webrtc bus](./packages/mesh-webrtc-bus)
    - Other Adapters
      - [http bus](./packages/mesh-http-bus) - HTTP request bus
    - Other Busses
      - [upsert ds action](./packages/mesh-webrtc-bus) - adds upsert (insert/update) action for DS busses
      - [tailable bus](./packages/mesh-tailable-bus) - adds ability to listen for all executed operations
      - [remote protocol adapter bus](./packages/mesh-remote-bus) - adapter bus for any realtime protocol
- Discuss
  - [Google group](https://groups.google.com/forum/#!forum/meshjs)
  - [Gitter chat](https://gitter.im/crcn/mesh.js)
- Companies using Mesh
  - [HelloSign](https://www.hellosign.com/)
- Articles
  - [Why re-write code when you can strangle it?](http://blog.hellosign.com/why-rewrite-your-code-when-you-can-strangle-it/)

## Licence (MIT)

Copyright (c) 2015 [Craig Condon](http://crcn.io)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
