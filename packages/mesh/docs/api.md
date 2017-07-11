# <a href="https://mesh.js.com/">Mesh</a> <span>v8.0.1</span>

<!-- div class="toc-container" -->

<!-- div -->

## `Properties`
* <a href="#race">`race`</a>
* <a href="#sequence">`sequence`</a>

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `Properties`

<!-- div -->

<h3 id="race"><a href="#race">#</a>&nbsp;<code>race</code></h3>
[View in source](https://github.com/crcn/mesh.js/blob/8.0.1/packages/mesh/lib/bundle.js#L907)

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
[View in source](https://github.com/crcn/mesh.js/blob/8.0.1/packages/mesh/lib/bundle.js#L645)

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

 [1]: #properties "Jump back to the TOC."
