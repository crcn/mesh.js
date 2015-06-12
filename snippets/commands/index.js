var mesh = require("mesh");
module.exports = function(commands, bus) {

  var cs = {};

  for (var name in commands) {

    var handler = commands[name];

    if (handler.length === 2) {
      handler = mesh.wrap(handler);
    }

    cs[name] = handler;
  }

  return mesh.fallback(function(operation) {
    var command = cs[operation.name] || bus || mesh.noop;
    return command(operation);
  });
}
