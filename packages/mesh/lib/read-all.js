"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pump_1 = require("./pump");
function readAll(source) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var result = [];
        pump_1.pump(source, function (chunk) { return result.push(chunk); }).then(resolve.bind(_this, result)).catch(reject);
    });
}
exports.readAll = readAll;
//# sourceMappingURL=read-all.js.map