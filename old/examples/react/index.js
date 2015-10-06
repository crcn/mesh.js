var React     = require("react");
var Main      = require("./components/main");
var createBus = require("./bus");

var bus = createBus();

React.render(React.createElement(Main, { bus: bus }), preview.element);
