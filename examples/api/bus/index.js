var api      = require("./api");
var join     = require("extra/join");
var spy      = require("./spy");

module.exports = function(options, bus) {

  // main bus
  if (!bus) {
    bus = api(options);
  }

  // abiilty to spy on opeations & streams
  bus     = spy(bus, function(spy, operation) {
    return spy.collection === operation.collection;
  });

  bus     = join(bus);

  return bus;
};
