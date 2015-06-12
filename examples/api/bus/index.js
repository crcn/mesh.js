var api = require("./api");

module.exports = function(options) {
  var bus = api(options);
  return bus;
}
