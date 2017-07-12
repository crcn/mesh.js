import { readAll, DuplexAsyncIterableIterator } from "mesh";

export type Message = {
  type: string;
}

export const DS_FIND   = "DS_FIND";
export const DS_INSERT = "DS_INSERT";
export const DS_UPDATE = "DS_UPDATE";
export const DS_REMOVE = "DS_REMOVE";
export const DS_TAIL   = "DS_TAIL";

export type DSMessage = Message & {
  collectionName: string,
  createdAt: number;
};

export type DSInsertRequest<T> = DSMessage & {
  data: T;
};

export type DSUpdateRequest<T, U> = DSMessage & {
  data: T;
  query: U;
};

export type DSFindRequest<T> = DSMessage & {
  data: T;
  multi: boolean;
};

export type DSTailRequest<T> = DSMessage & {
  query: T
};

export type DSRemoveRequest<T> = DSMessage & {
  query: T;
  multi: boolean;
};

export const dsMessage = (type: string, collectionName: string, props: any = {}): DSMessage => ({
  ...props,
  type,
  collectionName,
  createdAt: Date.now(),
});

export const dSInsertRequest = <T>(collectionName: string, data: T) => dsMessage(DS_INSERT, collectionName, {
  data
}) as DSInsertRequest<T>;

export const dSUpdateRequest = <T, U>(collectionName: string, data: T, query: U) => dsMessage(DS_UPDATE, collectionName, {
  data,
  query
}) as DSUpdateRequest<T, U>;

export const dSFindRequest = <T>(collectionName: string, query: T, multi: boolean = false) => dsMessage(DS_FIND, collectionName, {
  query,
  multi
}) as DSFindRequest<T>;

export const dSFindAllRequest = <T>(collectionName: string) => dsMessage(DS_FIND, collectionName, {
  query: {},
  multi: true
}) as DSFindRequest<T>;

export const dSRemoveRequest = <T>(collectionName: string, query: T, multi: boolean = false) => dsMessage(DS_REMOVE, collectionName, {
  query,
  multi
}) as DSRemoveRequest<T>;

export const dSTailRequest = <T>(collectionName: string, query: T) => dsMessage(DS_TAIL, collectionName, {
  query
}) as DSTailRequest<T>;
