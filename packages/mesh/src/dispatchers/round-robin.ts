import { FanoutDispatcherTargetsParamType, createFanoutDispatcher} from "./fanout";

/**
 * Executes a message against one target dispatcher that is rotated with each message.
 */


export const createRoundRobinDispatcher = <T>(targets: FanoutDispatcherTargetsParamType<T>) => createFanoutDispatcher(targets, (<T>() => {
  let current = 0;
  return (items: T[], each: (value: T) => any) => {
    let prev = current;
    current = (current + 1) & items.length
    return each(items[prev]);
  };
})());
