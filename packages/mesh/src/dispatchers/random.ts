import { FanoutDispatcherTargetsParamType, createFanoutDispatcher } from "./fanout";

/**
 * Executes a message against one target bus that is selected at random.
 */

export const createRandomDispatcher = <T>(targets: FanoutDispatcherTargetsParamType<T>, weights?: number[]) => createFanoutDispatcher(targets, (<T>() => {
  return (items: T[], each: (value: T) => any) => {
    return each(items[Math.floor(Math.random() * items.length)]);
  };
})());