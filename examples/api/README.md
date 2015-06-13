A more elaborate example demonstrating how you can use mesh to build a system that's decoupled from data
sources. It also happens to be isomorphic, and is setup to support realtime data in the future.

#### Usage

First run the server:

```
node server
```

Then run the client:

```
node client
```

#### Features

- Client-side caching for server requests.
- Models & bus logic can run on any platform.
- Client-side operations are normalized to a semi-funky API (see [routes file here](./bus/api/routes/index.js)).
- Demonstrates how to `tail` operations.

#### TODO

- [ ] realtime data
- [ ] demo swapping out memory db with mongodb
