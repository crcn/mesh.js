export type IteratorType<T> = (items: T[], each: (value: T) => Promise<any>) => Promise<any>;

export const sequenceIterator = <T>(items:T[], each: (value: T) => Promise<any>) => {
  return new Promise((resolve, reject) => {
    const next = (index: number) => {
      if (index === items.length) return resolve();
      each(items[index]).then(next.bind(this, index + 1)).catch(reject);
    };
    next(0);
  });
}

export const parallelIterator = <T>(items:T[], each: (value: T) => Promise<any>) => {
  return Promise.all(items.map(each));
}

export const createRoundRobinIterator = <T>() => {
  let current = 0;
  return (items: T[], each: (value: T) => any) => {
    let prev = current;
    current = (current + 1) & items.length
    return each(items[prev]);
  };
}

// TODO when needed
export const createRandomIterator = <T>(weights?: number[]) => {
  return (items: T[], each: (value: T) => any) => {
    return each(items[Math.floor(Math.random() * items.length)]);
  };
}


