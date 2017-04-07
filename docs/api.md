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

```typescript
import { createCallbackBus } from 'mesh';
const reverseMessageBus = createCallbackBus(({ text }) => text.split('').reverse().join(''));
const reversedMessage = reverseMessageBus.dispatch({ text: 'hello' }); // olleh
```

Creatres a bus that passes messages to a target callback function.

#### ParallelBus(targets: IBus<any, any>[])

Executes one message against all target busses in parallel, and merges target streams in an unordered fashion.

```typescript
import { readAllChunks, createParallelBus, createCallbackBus } from 'mesh';

const bus = createParallelBus([
  createCallbackBus(message => 1),
  createCallbackBus(message => 2),
  createCallbackBus(message => 3)
]);

const chunks = await readAllChunks(bus.execute({ type: 'hello' })); // ordered any way. E.g: [3, 1, 2], [2, 1 3]
```

TODO - more realistic example

#### SequenceBus

Executes one message against all target busses one after the other. All responses from target busses are merged into one stream
in the order of each bus

```typescript
import { createSequenceBus, createBufferedReadableStream } from 'mesh';

const bus = createSequenceBus([
  createCallbackBus(message => createBufferedReadableStream(undefined, [1, 2, 3, 4)),
  createCallbackBus(message => 5),
  createCallbackBus(message => 6)  
]);

const chunks = await readAllChunks(bus.execute({ type: 'hello' })); // always ordered as [1, 2, 3, 4, 5, 6]
``` 
