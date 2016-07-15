This example takes responses from a remote data store & caches them in a local store. For example:

```javascript

// map DS actions to the API
var commands = [

    sift({ name: 'load', collection: 'todos' }), WrapBus.create(async function() {
        return await fetch({
            url: '/todos',
            method: 'GET'
        });
    }),

    sift({ name: 'insert', collection: 'todos' }), WrapBus.create(async function() {
        return await fetch({
            url: '/todos',
            method: 'POST'
        });
    })
]

var noop = NoopBus.create();

var apiBus = WrapBus.create(function(action) {

    for (var i = 0, n = commands.length; i += 2) {
        if (commands[i](action)) return commands[i + 1].execute(action);
    }

    return noop.execute(action);
});

var memBus = MemoryDsBus.create();
var bus    = CacheBus.create(memBus, apiBus);

// HIT API
var todos = await bus.execute({ action: 'load', collection: 'todos' });

// HIT memory ds
var todos = await bus.execute({ action: 'load', collection: 'todos' });
```
