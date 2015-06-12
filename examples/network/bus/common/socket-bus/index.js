var ros      = require("ros");

/**
 */

module.exports = function(client, bus) {
  return ros(function(onMessage) {
    client.on("data", function(data) {
      String(data).split("|||||").forEach(function(chunk) {
        if (chunk === "") return;
        onMessage(JSON.parse(chunk));
      });
    });
  }, function send(payload) {
    client.write(JSON.stringify(payload) + "|||||");
  }, bus);
}
