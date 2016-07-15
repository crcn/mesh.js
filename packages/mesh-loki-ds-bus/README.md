Streamable data store bus for [LokiJS](http://lokijs.org/#/), an in-memory JavaScript database. Action docs on this library can be viewed here: https://github.com/crcn/mesh.js/blob/master/docs/adapters/data-stores.md.

**Installation**: `npm install mesh-loki-ds-bus`

basic example:

```javascript
var mesh      = require("mesh");
var LokiDsBus = require('mesh-loki-ds-bus');
var loki      = require('lokijs');

// setup the DB
var dsBus = LokiDsBus.create({
  target: new loki(__dirname + "/db.json")
});

var cursor = dsBus.execute({
  collection : 'people',
  action     : 'name',
  data       : [
    { name: "Sleipnir"    , legs: 8 },
    { name: "Jormungandr" , legs: 0 },
    { name: "Hel"         , legs: 2 }
  ]
});

cursor.readAll().then(function(people) {

});
```

#### LokiDsBus.create(options)

Creates a new loki data store bus.

- `options`
  - `target` - the target loki instance.
