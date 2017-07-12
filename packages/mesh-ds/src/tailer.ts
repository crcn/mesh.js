// import sift from "sift";

// import { 
//   create
// } from "mesh";

// import { 
//   Message,
//   DSTailRequest, 
//   DSTailedOperation, 
//   DSInsertRequest, 
//   DSMessage,
//   DSRemoveRequest, 
//   DSUpdateRequest 
// } from "./messages";

// export const dsTailer = (fn: (message: Message) => any) => (message: Message) => {
  
// };

// export class DSTailer implements IStreamableBus<any> {
//   private _tails: {
//     [IDentifier: string]: Array<[Function, (message: DSMessage, data) => any]>;
//   }

//   constructor(readonly target: IStreamableBus<any>) {
//     this._tails = {};
//   }

//   dispatch(message: IMessage) {
//     if (message.type === DSTailRequest.DS_TAIL) {
//       const tailRequest = message as DSTailRequest;
//       if (!this._tails[tailRequest.collectionName]) {
//         this._tails[tailRequest.collectionName] = [];
//       }
//       const tailCollection = this._tails[tailRequest.collectionName];

//       return new DuplexAsyncIterableIterator((input, output) => {

//         const writer = output.getWriter();

//         const onChange = async (request, data) => {
//           try {
//             await writer.write(new DSTailedOperation(request, data));
//           } catch(e) {
//             untail();
//           }
//         }

//         const tail = [sift((message as DSTailRequest).query) as Function, onChange] as any;

//         const untail = () => {
//           const i = tailCollection.indexOf(tail);
//           if (~i) tailCollection.splice(i, 1);
//         }
        
//         input.pipeTo(new WritableStream({
//           abort: untail,
//           close: untail
//         }));

//         tailCollection.push(tail);
//       });
//     } else if ([DSInsertRequest.DS_INSERT, DSRemoveRequest.DS_REMOVE, DSUpdateRequest.DS_UPDATE].indexOf(message.type) > -1) {
//       return new DuplexAsyncIterableIterator((input, output) => {
//         const writer = output.getWriter();

//         const tailCollection = this._tails[(message as DSMessage).collectionName] || [];
//         this.target.dispatch(message).readable.pipeTo(new WritableStream({
//           write: (chunk) => {
//             writer.write(chunk);
//             for (const [filter, callback] of tailCollection) {
//               if (filter(chunk)) {
//                 callback(message as any, chunk);
//               }
//             }
//           }
//         })).then(writer.close.bind(writer)).catch(writer.abort.bind(writer));
//       });
//     } else {
//       return this.target.dispatch(message);
//     }
//   }
// }