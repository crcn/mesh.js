import { DSMessage, DSInsertRequest, DSFindRequest, DSRemoveRequest, DSUpdateRequest } from "./messages";
import { proxy } from "mesh";

type DataStoreOptions = {
  dsFind(message: DSFindRequest<any>);
  dsInsert(message: DSInsertRequest<any>);
  dsRemove(message: DSRemoveRequest<any>);
  dsUpdate(message: DSUpdateRequest<any, any>);
}

export const dataStore = (getOptions: () => Promise<DataStoreOptions> ) => proxy((message: DSMessage) => new Promise((resolve) => {
  getOptions().then(options => {
    resolve(message && options[message.type] || (() => {}));
  });
})); 