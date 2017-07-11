"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var noop_1 = require("./noop");
describe(__filename + "#", function () {
    it("can be created", function () {
        new noop_1.NoopBus();
    });
    it("doesn't do anything when dispatch is called", function () {
        new noop_1.NoopBus().dispatch({});
    });
});
//# sourceMappingURL=noop-test.js.map