### Busses

Busses route your messages according to the rules that you give them. They are generally unopinonated, and composable.

#### IBus<T, U>

`T` - the message type
`U` - the return type

```typescript

interface IHelloMessage {
  text: string;
}

const reverseMessageBus: IBus<IHelloMessage, string> = {
  dispatch({ text }: IHelloMessage) {
   return text.split('').reverse().join('');
  }
};

const reversedMessage = reverseMessageBus.dispatch({ text: 'hello' }); // 'olleh
```

#### CallbackBus<T, U>(callback: (message: T) => U);

Creates a bus that passes messages to a target callback function.

```typescript
import { createCallbackBus } from 'mesh';
const reverseMessageBus = createCallbackBus(({ text }) => text.split('').reverse().join(''));
const reversedMessage = reverseMessageBus.dispatch({ text: 'hello' }); // olleh
```

#### FanoutBus(targets: IBus[], iterator: (targets: IBus[], each: (target: IBus) => Promise))

Creates a bus that fans out a message to one or more target busses.

```typescript
import { readOneChunk, createFanoutBus, createCallbackBus } from 'mesh';

const randomBus = createFanoutBus([
  createCallbackBus(message => 1),
  createCallbackBus(message => 2),
  createCallbackBus(message => 3),
], (items, each) => each(items[Math.floor(Math.random() * items.length)]));

readOneChunk(randomBus.dispatch(undefined)); // random - could be 3
readOneChunk(randomBus.dispatch(undefined)); // random - could be 1
readOneChunk(randomBus.dispatch(undefined)); // random - could be 2
readOneChunk(randomBus.dispatch(undefined)); // random - could be 3
```

#### ParallelBus(targets: IBus[])

Executes one message against all target busses in parallel, and merges target streams in an unordered fashion.

```typescript
import { readAllChunks, createParallelBus, createCallbackBus } from 'mesh';

const bus = createParallelBus([
  createCallbackBus(message => 1),
  createCallbackBus(message => 2),
  createCallbackBus(message => 3)
]);

await readAllChunks(bus.execute({ type: 'hello' })); // ordered any way. E.g: [3, 1, 2], [2, 1 3]
```

TODO - more realistic example

#### SequenceBus(targets: IBus[])

Executes one message against all target busses one after the other. All responses from target busses are merged into one stream
in the order of each bus

```typescript
import { createSequenceBus, createBufferedReadableStream } from 'mesh';

const bus = createSequenceBus([
  createCallbackBus(message => createBufferedReadableStream(undefined, [1, 2, 3, 4)),
  createCallbackBus(message => 5),
  createCallbackBus(message => 6)  
]);

await readAllChunks(bus.execute({ type: 'hello' })); // always ordered as [1, 2, 3, 4, 5, 6]
``` 

#### RandomBus(targets: IBus[])

Dispatches a message against one randomly selected bus.

```typescript
const { createRandomBus } from 'mesh';
const bus = createRandomBus([
  createCallbackBus(message => 1),
  createCallbackBus(message => 2),
  createCallbackBus(message => 3)
]);

bus.dispatch(); // random - could be 1
bus.dispatch(); // 3
bus.dispatch(); // 2
bus.dispatch(); // 1
```

#### RoundRobinBus(targets: IBus[])

Dispatches a message against a rotated target bus.

```typescript
import { createRoundRobinBus } from 'mesh';
const bus = createRoundRobinBus([
  createCallbackBus(message => 1),
  createCallbackBus(message => 2),
  createCallbackBus(message => 3)
]);

bus.dispatch(); // 1
bus.dispatch(); // 2
bus.dispatch(); // 3
bus.dispatch(); // 1
bus.dispatch(); // 2
```

#### FilterBus()

#### NoopBus()


#### ObservableBus()

#### ChannelBus()

Creates a new messaging channel within an stream.

```typescript
import { createChannelBus, createCallbackBus, createDuplexStream } from 'mesh';

const transformBus = createCallbackBus({transform} => createDuplexStream(async (input, output) => {
  let chunk;
  const inceptionBus = createChannelBus(input, output);
  while(const { done, value: { text } } = await inceptionBus.read()) {
    if (done) break;
    inceptionBus.write(transform(text.toUpperCase()));
  }

  inceptionBus.dispose();
}));

const uppercaseTransformBus = transformBus.dispatch({ transform: v => v.toUpperCase(); });
uppercaseTransformBus.dispatch({ text: 'hello' }); // HELLO
uppercaseTransformBus.dispatch({ text: 'hola'  }); // HOLA
```

#### RemoteBus()

Creates a bus that serializes & deserializes messages from and to a remote location via HTTP, websockets, and other protocols.

TODO example

#### Utilities

#### readOneChunk(readableStream: any): Promise<any>
#### readAllChunks(readableStream: any): Promise<any[]>
#### noopBusInstance