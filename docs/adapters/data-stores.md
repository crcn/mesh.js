Mesh comes with a number of data store adapters including Mongodb, Lokijs, Rethinkdb, among others. All data store
adapters share a similar API to ensure interoperability with other mesh plugins. Individual data store adapters *may* implement custom
APIs specific to the service they're interfacing. Checkout the package of whatever DS you're using for additional functionality.

Below are a set of actions you can execute against **all** data store adapters.

#### execute({ action: 'insert', data: data, collection: collectionName })

Inserts a new record into the data store.

```javascript
var cursor = ds.execute({ action: 'insert', collection: 'people', data: { name: 'lowe bouie' });
cursor.read().then(function(recordData) {
  console.log(recordData); // { name: 'hello john' }
});
```

#### execute({ action: 'load', query: query, collection: collectionName, multi: false })

Loads a record from the data store. Note that the `query` parameter *always* accepts plain old JavaScript objects. Certain
data stores however might extend the functionality of the query parameter to support other syntaxes. the MongoDsBus adapter for instance
supports the mongodb query langauge.

By default, this operation returns *one* object. You'll need to set `multi=true` in order to load multiple records from the target
data store.

```javascript
var cursor = ds.execute({ action: 'load', collection: 'people', query: { name: 'lowe bouie' }});
cursor.read().then(function(recordData) {
  console.log(recordData); // { name: 'hello john' }
});
```

#### execute({ action: 'remove', query: query, collection: collectionName, multi: false })

Removes one record from the target data store. `multi` must be `true` to remove multiple items. 

```javascript
var cursor = ds.execute({ action: 'remove', collection: 'people', query: { name: 'lowe bouie' }});
cursor.read().then(function(recordData) {
  console.log(recordData); // { name: 'hello john' }
});
```

#### execute({ action: 'update', query: query, collection: collectionName, multi: false })

Replaces *one* item with `data` in the target data store that matches the `query` parameter. `multi=true` will replace multiple items in the data store
that matches `query`.

```javascript
var cursor = ds.execute({ action: 'update', collection: 'people', query: { name: 'lowe bouie' }, data: { name: 'ya bouie' });
cursor.read().then(function(recordData) {
  
});
```
