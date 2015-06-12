var api      = require("./api");
var realtime = require("./realtime");
var fake     = require("./fake");

module.exports = function(options) {

  var bus = api(options);

  // realtime
  bus     = realtime(options, bus);

  // use fixtures
  bus     = fake(options, bus);

  return bus;
}
