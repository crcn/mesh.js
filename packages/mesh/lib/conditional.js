"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var proxy_1 = require("./proxy");
/**
 * Executes a message against target function if filter returns true, otherwise execute a message against falsy function is provided.
 */
exports.conditional = function (_if, _then, _else) { return proxy_1.proxy(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return _if.apply(void 0, args) ? _then : _else;
}); };
//# sourceMappingURL=conditional.js.map