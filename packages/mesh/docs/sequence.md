# sequence.js API documentation

<!-- div class="toc-container" -->

<!-- div -->

## `sequence`
* <a href="#sequence">`sequence`</a>

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `sequence`

<!-- div -->

<h3 id="sequence"><a href="#sequence">#</a>&nbsp;<code>sequence</code></h3>
[&#x24C8;](/Users/crcn/Developer/public/mesh.js/packages/mesh/lib/sequence.js#L21 "View in source") [&#x24C9;][1]

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

 [1]: #sequence "Jump back to the TOC."
