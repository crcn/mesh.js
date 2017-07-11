# <a href="https://mesh.js.com/">Mesh</a> <span>v8.0.2</span>

<!-- div class="toc-container" -->

<!-- div -->

## `Methods`
* <a href="#pipe">`pipe`</a>
* <a href="#when">`when`</a>

<!-- /div -->

<!-- div -->

## `Properties`
* <a href="#race">`race`</a>
* <a href="#sequence">`sequence`</a>

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `Methods`

<!-- div -->

<h3 id="pipe"><a href="#pipe">#</a>&nbsp;<code>pipe(source, [through])</code></h3>

[View in source](https://github.com/crcn/mesh.js/blob/8.0.6/packages/mesh/lib/bundle.js#L891)

Pipes yielded data though each iterable in the pipeline

#### Arguments
1. `source` *(AsyncIterableIterator|IterableIterator)*: the first iterable in the pipeline
2. `[through]` *(AsyncIterableIterator|IterableIterator)*: proceeding iterables to pass yielded data through

#### Example
```js
import { pipe, through, readAll } from "mesh";

const negate = (values) => pipe(
  values,
  through(a => -a)
);

const negativeValues = await readAll(negate([1, 2, 3])); // [-1, -2, -3]
```
---

<!-- /div -->

<!-- div -->

<h3 id="when"><a href="#when">#</a>&nbsp;<code>when(tester, [then], [else])</code></h3>

[View in source](https://github.com/crcn/mesh.js/blob/8.0.6/packages/mesh/lib/bundle.js#L610)

Conditional that calls target functions based on the tester

#### Arguments
1. `tester` *(Function)*: test function for the arguments passed in `when`
2. `[then]` *(Function)*: called when test passes `true`
3. `[else]` *(Function)*: called when test passes `false`

#### Example
```js
const sift = require("sift");

const dataStore = (items) => {

  const findMulti = (message) => items.filter(sift(message.query));
  const findOne = (message) => items.find(sift(message.query));
  const remove = (message) => { }

  return when(
    message => message.type === 'find',
    when(
      message => message.multi,
      findMulti,
      findOne
    ),
    when(
      message => message.type === 'remove',
      remove
    )
  )

  return when(message => message.multi, findMulti, findOne);
};

const dsDispatch = dataStore([
 { name: 'Jeff', age: 2 },
 { name: 'Samantha', age: 65 },
 { name: 'Craig', age: 99 }
]);

const people = await readAll(dsDispatch({ multi: true, query: { age: { $gt: 2 } } })); // [[{ name: 'Samantha', age: 65 }, { name: 'Craig', age: 99 }]]

const person = await readAll(dsDispatch({ query: { age: 2 }})); // [{ name: 'Jeff', age: 2 }]
```
---

<!-- /div -->

<!-- /div -->

<!-- div -->

## `Properties`

<!-- div -->

<h3 id="race"><a href="#race">#</a>&nbsp;<code>race</code></h3>

[View in source](https://github.com/crcn/mesh.js/blob/8.0.6/packages/mesh/lib/bundle.js#L965)

Calls all target functions in parallel, and returns the yielded values of the _fastest_ one.

#### Example
```js
const ping = race(

);
```
---

<!-- /div -->

<!-- div -->

<h3 id="sequence"><a href="#sequence">#</a>&nbsp;<code>sequence</code></h3>

[View in source](https://github.com/crcn/mesh.js/blob/8.0.6/packages/mesh/lib/bundle.js#L686)

Executes functions in sequence

#### Example
```js
const ping = sequence(
 () => "pong1",
 () => "pong2"
);

const iter = ping();
await iter.next(); // { value: "pong1", done: false }
await iter.next(); // { value: "pong2", done: false }
await iter.next(); // { value: undefined, done: true }
```
---

<!-- /div -->

<!-- /div -->

<!-- /div -->

 [1]: #methods "Jump back to the TOC."
