Simple example demonstrating a distributed system using sockets & mesh

### Features

- fault tolerant. operations get re-executed if they fail. Possibility of queueing operation in a DB in the future.
- dynamically able to set load balancing weight of workers.
- supports load balancing algorithims: `roundRobin`, `least connections`, `random`, etc.


### Command line usage

````
cd examples/network; node .
> startWorker(count[, weight]) # starts worker with distribution weight (higher number = higher priority)
> stopWorker([workerIds])
> execute(operation) # executes an operation against the workers
````

### Sample operations

````
> execute({ name: "pingPong", count: 5, dist: "random" }) # recursive ping pong between master & slaves until count is 0
> execute({ name: "fib", dist: "random" })
> execute({ name: "healthcheck" }) # runs healthcheck against all workers
````


#### execution options

- `dist` - distribution type: `roundRobin`, `random`, `parallel`, `sequence`, `least`
