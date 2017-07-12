import sift from "sift";
import { dataStore, DSFindRequest, DSInsertRequest, DSRemoveRequest, DSUpdateRequest, DSMessage } from "mesh-ds";
import { ReadableStream, DuplexAsyncIterableIterator } from "mesh";
import mongoid = require("mongoid-js");

export class MemoryDataStore extends BaseDataStore {

  private _data: {
    [Identifier: string]: any[]
  };

  constructor() {
    super();
    this._data = {};
  }

  dsFind({ type, collectionName, query, multi }: DSFindRequest<any>) {
    const found = this.getCollection(collectionName).filter(sift(query) as any);
    return DuplexAsyncIterableIterator.fromArray(found.length ? multi ? found : [found[0]] : []);
  }

  dsInsert({ type, collectionName, data }: DSInsertRequest<any>) {
    let ret = JSON.parse(JSON.stringify(data));
    if (!ret._id) ret._id = mongoid();
    ret = Array.isArray(ret) ? ret : [ret];
    this.getCollection(collectionName).push(...ret);
    return DuplexAsyncIterableIterator.fromArray(ret);
  }

  dsRemove({ type, collectionName, query }: DSRemoveRequest<any>) {
    const collection = this.getCollection(collectionName);
    const filter = sift(query) as any;
    const ret = [];
    for (let i = collection.length; i--;) {
      const item = collection[i];
      if (filter(item)) {
        ret.push(item);
        collection.splice(i, 1);
      }
    }
    return DuplexAsyncIterableIterator.fromArray(ret);
  }

  dsUpdate({ type, collectionName, query, data }: DSUpdateRequest<any, any>) {
    const collection = this.getCollection(collectionName);
    const filter = sift(query) as any;
    const ret = [];
    for (let i = collection.length; i--;) {
      const item = collection[i];
      if (filter(item)) {
        Object.assign(item, JSON.parse(JSON.stringify(data)));
        ret.push(item);
      }
    }

    return DuplexAsyncIterableIterator.fromArray(ret);
  }

  private getCollection(collectionName: string) {
    return this._data[collectionName] || (this._data[collectionName] = []);
  }
}