import { FanoutDispatcherTargetsParamType, createFanoutDispatcher } from "./fanout";

/**
 * Executes a message against one target dispatcher that is selected at random.
 */

export const createRandomDispatcher = <T>(targets: FanoutDispatcherTargetsParamType<T>, weights?: number[]) => createFanoutDispatcher(targets, (<T>() => {
  return (items: T[], each: (value: T) => any) => {
    const weighted = [];
    if (weights) {
      let i = 0;
      const n = Math.min(weights.length, items.length);
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