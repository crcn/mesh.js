[![Build Status](https://travis-ci.org/mojo-js/mesh-local-storage.svg)](https://travis-ci.org/mojo-js/mesh-local-storage) [![Coverage Status](https://coveralls.io/repos/mojo-js/mesh-local-storage/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/mesh-local-storage?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/mesh-local-storage.svg)](https://david-dm.org/mojo-js/mesh-local-storage)

This module is a local storage database adapter for [mesh](https://github.com/mojo-js/mesh.js) - a library that makes it easy to persist data through multiple transports.

#### Features

- offline-mode - enable users to browse your application without an API (assuming there's local data)
- faster initial load times - great for mobile devices
- can be used with other database transports such as [mesh-http](https://github.com/mojo-js/mesh-http)
- cascades operations to other transports


#### installation

```
npm install mesh-local-storage
```

```javascript
var mesh = require("mesh");
var localdb = require("mesh-local-storage");

var db = mesh(localdb());
```

#### db localdb(options)

creates a local meshelt database

- `options` - options for the local db
  - `storageKey` - storage key to use
  - `store` - store to use

```javascript
var db = localdb({
  storageKey: "storage-key",
  store: {
    get: function(storageKey) {
      // return DB yere
    },
    set: function(storageKey, value) {
      // set db here
    }
  }
});
```

#### db.run(operation, options, onComplete)

runs an operation

- `operation` - operation to run can be: `insert`, `remove`, `update`, or `load`
- `options` - operation specific options

insert options:

- `data` - data to insert. Can be an object, or an array to insert multiple

```javascript
db.run("insert", { data: [{ name: "a"}, { name: "b" }]}); // insert two items
db.run("insert", { data: { name: "gg"}}); // insert one item
```

remove options:

- `query` - mongodb search query
- `multi` - TRUE if you want to remove multiple items (false by default)

update options:

- `query` - mongodb search query
- `multi` - TRUE if you want to update multiple items (false by default)
- `data` - data to set - this is merged with existing data

load options:

- `query` - mongodb search query
- `multi` - TRUE if you want to load multiple items (one by default)
