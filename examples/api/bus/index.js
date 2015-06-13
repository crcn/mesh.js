var api      = require("./api");
var join     = require("extra/join");
var realtime = require("./realtime");
var fake     = require("./fake");
var spy      = require("./spy");

module.exports = function(options, bus) {

  // main bus
  if (!bus) {
    bus = api(options);
  }

  // realtime
  // bus     = realtime(options, bus);

  // use fixtures
  bus     = fake(options, bus);

  // abiilty to spy on opeations & streams
  bus     = spy(bus, function(spy, operation) {
    return spy.collection === operation.collection;
  });

  bus     = join(bus);

  return bus;
};
