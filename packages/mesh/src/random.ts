import { combine } from "./combine";

/**
 * Executes a message against one target dispatcher that is selected at random.
 */

type WeightedOptions = Function | [number, Function];

const getFunctions = (ops: WeightedOptions[]) => ops.map(op => (
  (typeof op === "function" ? op : op[1]) as Function
)) as Function[];

const getWeights = (ops: WeightedOptions[]) => ops.map(op => (
  (typeof op === "function" ? 1 : op[0]) as number
)) as number[];

export const random = <T>(...ops: WeightedOptions[]) => combine(getFunctions(ops), (<T>() => {
  return (items: T[], each: (value: T) => any) => {
    const weighted = [];
    const weights = getWeights(ops);
    if (weights) {
      let i = 0;
      const n = weights.length;
      for (; i < n; i++) {
        const weight = weights[i];
        for (let j = weight; j--;) {
          weighted.push(items[i]);
        }
      }
      weighted.push(...items.slice(i));

    } else {
      weighted.push(...items);
    }

    return each(weighted[Math.floor(Math.random() * weighted.length)]);
  };
})());