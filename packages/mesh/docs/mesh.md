# Mesh API

<!-- div class="toc-container" -->

<!-- div -->

## `race`
* <a href="#race">`race`</a>

<!-- /div -->

<!-- div -->

## `sequence`
* <a href="#sequence">`sequence`</a>

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `race`

<!-- div -->

<h3 id="race"><code>race</code></h3>
[&#x24C8;](http://github.com/crcn/mesh.js/blob/8.0.0/packages/mesh/lib/bundle.js#L907 "View in source") [&#x24C9;][1]

Calls all target functions in parallel, and returns the yielded values of the _fastest_ one.

#### Example
```js
const ping = race(

);
```
---

<!-- /div -->

<!-- /div -->

<!-- div -->

## `sequence`

<!-- div -->

<h3 id="sequence"><code>sequence</code></h3>
[&#x24C8;](http://github.com/crcn/mesh.js/blob/8.0.0/packages/mesh/lib/bundle.js#L645 "View in source") [&#x24C9;][1]

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

 [1]: #race "Jump back to the TOC."