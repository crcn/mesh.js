Mesh makes it easy to unify how your application interacts with databases. This unlocks the possibility of swapping databases out, connecting them, and even faking them when running tests. This idealogy however only works so-long as you write database adapters that follow the same patterns. Here's a basic template you can use to help with that:

```javascript
import { EmptyResponse, Bus } from "mesh";

class DatabaseBus extends Bus {
  constructor(createCollection) {
    super()
    this._collections = {};
    this._createCollection = createCollection;
  }
  execute: function(operation) {
  
    // only accept certain actions
    if (/insert|remove|update|load/.test(operation.action)) {
      var collection = this.getCollection(operation);
      return collection[operation.action].call(collection, operation);
    } else {
      return EmptyResponse.create();
    }
  }
  getCollection: function(operation) {
    if (!operation.collection) throw new Error("collection must exist for CRUD-based operations");
    return this._collections[operation.collection] || (this._collections[operation.collection] = this._createCollection(operation.collection));
  }
}
```
