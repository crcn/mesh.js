"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mesh_1 = require("mesh");
exports.dataStore = function (getOptions) { return mesh_1.proxy(function (message) { return new Promise(function (resolve) {
    getOptions().then(function (options) {
        resolve(message && options[message.type] || (function () { }));
    });
}); }); };
//# sourceMappingURL=base-store.js.map