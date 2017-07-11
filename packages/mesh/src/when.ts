import { wrapAsyncIterableIterator } from "./wrap-async-iterable-iterator";
import { proxy } from "./proxy";


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

export const when = <T>(_if: (...args) => boolean, _then?: Function, _else?: Function) => proxy((...args) => _if(...args) ? _then : _else);
