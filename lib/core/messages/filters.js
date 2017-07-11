"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("./decorators");
exports.filterFamilyMessage = function (message, fromFamily, toFamily) {
    var targetFamily = decorators_1.getMessageTarget(message);
    var visitorFamilies = decorators_1.getMessageVisitors(message);
    // Rules:
    // 1. Target family must be defined, otherwise the message is private.
    // 2. If the bus of this message is part of the same family as the target, then return false.
    // 3. If the target family is equal to the destination family, then return true.
    // 4. If the message is only visiting the target family (meaning that there's another remote bus through the visitor), then return true.
    var passes = !!((targetFamily || visitorFamilies.length) && targetFamily !== fromFamily && (targetFamily === toFamily || visitorFamilies.indexOf(toFamily) !== -1));
    return passes;
};
//# sourceMappingURL=filters.js.map