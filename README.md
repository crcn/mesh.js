[![Build Status](https://travis-ci.org/crcn/mesh.js.svg)](https://travis-ci.org/crcn/mesh.js) [![Coverage Status](https://coveralls.io/repos/crcn/mesh.js/badge.svg?branch=master&service=github)](https://coveralls.io/github/crcn/mesh.js?branch=master) [![Join the chat at https://gitter.im/crcn/mesh.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/crcn/mesh.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


<p align="center">
  <img width="300px" style="margin:0px auto" src="https://cloud.githubusercontent.com/assets/757408/11253633/a825c1c8-8df1-11e5-972d-e9256d9b2e13.png">
</p>

Mesh is a utility library for [async iterable iterators](https://github.com/tc39/proposal-async-iteration). 

#### Motivation

This library was originally created to handle complex data flows, and unify how applications communicate internally and externally. It also serves as a _single_ channel for _all_ communication which makes it more easy to control & reason about how your application is passing around data asynchronously. 

Mesh provides a set of higher order functions that you can use to build your data flows out. Here's an example of that:

```typescript
import { when, wrapAsyncIterableIterator, fallback } from "mesh";
import { 
  DS_FIND, 
  DS_INSERT, 
  DS_REMOVE, 
  DS_UPDATE, 
  dataStore, 
  DSFindMessage,
  whenCollection,
  DSInsertMessage,
  DSRemoveMessage,
  DSUpdateMessage,
} from "mesh-ds";

const insertTodoItem = (message: DSInsertMessage) => (
  wrapAsnycIterableIterator(fetch('/api/todos', {
    method: 'POST',
    body: message.data
  }))
);

const insert = fallback(
  whenCollection('todos', insertTodoItem),

  // more collections below
  // whenCollection('users', insertUser),
  // whenCollection('items', insertItem),
);

const dsDispatch = dataStore({
  [DS_INSERT] : insert,

  // other operations - similar code to insert
  //[DS_REMOVE] : remove,
  //[DS_UPDATE] : update,
  //[DS_FIND]   : find
});
```

<!-- TODO - rollback,  -->


#### Installation

[NPM](https://www.npmjs.com/): `npm install mesh` <br />
[Bower](http://bower.io/): `bower install mesh`

#### Resources

- Documentation
  - [Core API](https://github.com/crcn/mesh.js/tree/master/packages/mesh/docs/api.md)
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

