import sift from "sift";
import { dataStoreDispatcher } from "mesh-ds";
import mongoid = require("mongoid-js");

export type MemoryDataStoreAdapter = {
  set(collectionName: string, data: any);
  get(collectionName: string): any;
};

export const memoryDataStoreDispatcher = (adapter: MemoryDataStoreAdapter) => dataStoreDispatcher(() => Promise.resolve({
  dsFind({ type, collectionName, query, multi }) {
    const found = (adapter.get(collectionName) || []).filter(sift(query) as any);
    return found.length ? multi ? found : [found[0]] : [];
  },
  dsInsert({ type, collectionName, data }) {
    let ret = JSON.parse(JSON.stringify(data));
    if (!ret._id) ret._id = mongoid();
    ret = Array.isArray(ret) ? ret : [ret];
    if (!adapter.get(collectionName)) adapter.set(collectionName, []);
    const collection = adapter.get(collectionName);
    collection.push(...ret);
    adapter.set(collectionName, collection);
    return ret;
  },
  dsUpdate({ type, collectionName, query, data }) {
    const collection = adapter.get(collectionName) || [];
    const filter = sift(query) as any;
    const ret = [];
    for (let i = collection.length; i--;) {
      const item = collection[i];
      if (filter(item)) {
        Object.assign(item, JSON.parse(JSON.stringify(data)));
        ret.push(item);
      }
    }
    adapter.set(collectionName, collection);
    return ret;
  },
  dsRemove({ type, collectionName, query }) {
    const collection = adapter.get(collectionName) || [];
    const filter = sift(query) as any;
    const ret = [];
    for (let i = collection.length; i--;) {
      const item = collection[i];
      if (filter(item)) {
        ret.push(item);
        collection.splice(i, 1);
      }
    }
    adapter.set(collectionName, collection);
    return ret;
  }
}));
