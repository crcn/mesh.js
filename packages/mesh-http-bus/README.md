[![Build Status](https://travis-ci.org/mojo-js/mesh-http.svg)](https://travis-ci.org/mojo-js/mesh-http) [![Coverage Status](https://coveralls.io/repos/mojo-js/mesh-http/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/mesh-http?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/mesh-http.svg)](https://david-dm.org/mojo-js/mesh-http)

HTTP (api) adapter for [mesh](http://github.com/mojo-js/mesh.js).

#### Installation

```
npm install mesh-http
```

#### http(operationName, options)

Performs a new operation on the API

- `options`
  - `url` - (optional) path to the route - automatically resolved by collection if this is omitted
  - `method` - (optional) resolved by mesh method
  - `headers` - (optional) HTTP headers
  - `query` -query params

```javascript
var mesh = require("mesh");
var http = require("mesh-http");
var bus  = http();

// POST /people?q=search { name: "abba" }
bus({
  url: "/people",
  method: "POST",
  data: { name: "abba" },
  query: { q: "search" }
});
```
