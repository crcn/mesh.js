"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.castGetter = function (value) { return typeof value === "function" ? value : function () { return value; }; };
/*
1. need to be able to abort stream from dispatched

for await (const value of read()) {
  break; // break to abort
}

const dispatch = (message: Message) => (value: string) =>
*/
//# sourceMappingURL=index.js.map