"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_1 = require("./proxy");
/**
 * Conditional that calls target functions based on the tester
 *
 * @param {Function} tester test function for the arguments passed in `when`
 * @param {Function} [then] called when test passes `true`
 * @param {Function} [else] called when test passes `false`
 *
 * @example
 *
 * const sift = require("sift");
 *
 * const dataStore = (items) => {
 *
 *   const findMulti = (message) => items.filter(sift(message.query));
 *   const findOne = (message) => items.find(sift(message.query));
 *   const remove = (message) => { }
 *
 *   return when(
 *     message => message.type === 'find',
 *     when(
 *       message => message.multi,
 *       findMulti,
 *       findOne
 *     ),
 *     when(
 *       message => message.type === 'remove',
 *       remove
 *     )
 *   )
 *
 *   return when(message => message.multi, findMulti, findOne);
 * };
 *
 * const dsDispatch = dataStore([
 *  { name: 'Jeff', age: 2 },
 *  { name: 'Samantha', age: 65 },
 *  { name: 'Craig', age: 99 }
 * ]);
 *
 * const people = await readAll(dsDispatch({ multi: true, query: { age: { $gt: 2 } } })); // [[{ name: 'Samantha', age: 65 }, { name: 'Craig', age: 99 }]]
 *
 * const person = await readAll(dsDispatch({ query: { age: 2 }})); // [{ name: 'Jeff', age: 2 }]
 *
 */
exports.when = function (_if, _then, _else) { return proxy_1.proxy(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return _if.apply(void 0, args) ? _then : _else;
}); };
//# sourceMappingURL=when.js.map