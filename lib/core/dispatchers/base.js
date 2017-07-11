"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDispatcherMessage = function (target, message) {
    return !!(target && target.testMessage && target.testMessage(message));
};
//# sourceMappingURL=base.js.map