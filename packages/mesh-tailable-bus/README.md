
Creates a bus that can be tailed for all actions executed against it.

**Installation**: `npm install mesh-tailable-bus`

```javascript
import TailableBus from 'mesh-tailable-bus';
var bus = TailableBus.create(NoopBus.create());
var tail = bus.createTail();

tail.pipeTo({
  write: function(action) {
    // handle tailed action - { action: "doSomething" }
  },
  close: function() { },
  abort: function() { }
});

// trigger tail
bus.execute({ action: "doSomething" });
```
