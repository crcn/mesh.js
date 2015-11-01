This bus enables you to execute operations against a remote bus.

```javascript
var localBus = WrapBus.create(function() {
    return 'hello';
});
var bus = ParallelBus.create([
    localBus,
    WebsocketBus.create('//ws-host', localBus)
]);

bus.execute({ action: 'doSomething' });
```
