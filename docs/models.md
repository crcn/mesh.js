Mesh can be used as the transport layer for models that represent data stored in some database. Here's a simple example of how to create this integration:

```javascript
class Model {

  /**
   * constructor
   * @param bus the transport for the model
   * @param the source of truth data for the model
   */

  constructor(collectionName, bus, data) {
    this.collectionName = collectionName;
    this.bus = bus;
    this.data = data || {};
  }

  /**
   * sets properties on the model data
   */

  setProperties(properties) {
    Object.assign(this.data, properties);
  }

  /**
   */

  getProperty(key) {
    return this.data[key];
  }

  /**
   * inserts the model
   */

  insert() {
    return this._sync("insert", {
      data: this.data
    })
  }

  /**
   */

  update() {
    return this._sync("update", {
      query : { _id: this.getProperty("_id") },
      data  : this.data
    })
  }

  /**
   */

  remove() {
    return this._sync("remove", {
      query: { _id: this.getProperty("_id") }
    });
  }

  /**
   * loads data from the source of truth
   */

  load() {
    return this._sync("load", {
      query: { _id: this.getProperty("_id") }
    })
  },

  /**
   * executes an operation against this model. Useful if you need to execute
   * any other operation against the model on the backend (user.resetPassword, user.logout)
   */

  fetch(action, operationProperties) {
    return this.bus.execute(Object.assign({
      action: action
    }, operationProperties));
  }

  /**
   * synchronizes data from the bus to this model
   */

  _sync(action, operationProperties) {
    var response = this.fetch(action, operationProperties);

    // the first chunk on the operation is the data returned from the
    // source of truth. We only want that.
    response.read().then((chunk) => {
      if (!chunk.done) this.data = chunk.value;
    });

    return response;
  }
}
```

This base model class is plain enough to be adaptable with just about any data source. Here's how you might use it with a mongodb bus:

```javascript
import { AttachDefaultsBus } from "mesh";

var bus = MongoDbBus.create();
// var bus = LocalStorageDbBus.create();
// var bus = MemoryDbBus.create();

// attach { collection: "people" } to all executed operations
var peopleDbCollectionBus = AttachDefaultsBus.create({
  collection: "people"
}, bus);

var model = new Model(peopleDbCollectionBus);

model.setProperties({
  name: "Tony"
});

model.insert().then(function() {
  console.log(model.data); // { _id: MongoId, name: "Tony" }
});
```
This example attaches a `collection` property for each operation since Mongodb needs to know where to create, read, update, and delete data from. By using the `AttachDefaultsBus` we can safely define this information *outside* of the model so that this adapter-specific code doesn't end up in our model base class. This pattern makes our base model, again, pretty adaptable many different use cases.

Creating a model base class that works with any data source is one thing. Making it testable is also important. Easy enough:


```javascript
import expect from "expect.js";
import Model from "./model";
import { BufferedResponse, AttachDefaultsBus } from "mesh";

// note - defining __filename in the describe block makes test files greppable. Super
// awesome for TDD.
describe(__filename + "#", function() {

  var ops = [];
  var bus;

  beforeEach(function() {
    ops = [];
    bus = {
      execute: function(operation) {
        ops.push(operation);
        return BufferedResponse.create.apply(this, operation.yields || []);
      }
    }
  });

  it("loads data on the model", async function() {

    var model = new Model(AttachDefaultsBus.create({ yields: [{ name: "joe", _id: "blarg" }] }, bus), {
      data: { _id: "blarg" }
    });

    await model.load();
    expect(ops.length).to.be(1);
    expect(ops[0].action).to.be("load");
    expect(ops[0].query._id).to.be("blarg");
    expect(model.data.name).to.be("joe");
  });

  // more tests here...
});
```

This test example is really only cto demonstrate how easy it use to mock bus code. Here's another way we can go about testing our base model with a re-usable [collection bus](https://gist.github.com/crcn/e049575c298826223e6c):

```javascript
var bus;
beforeEach(function() {
  bus = CollectionBus.create([
    { _id: "blarg", name: "joe" }
  ]);
});

it("loads data on the model", async function() {
  var model = new Model(bus, {
    data: { _id: "blarg" }
  });
  await model.load();
  expect(model.getProperty("name")).to.be("joe");
});
```
