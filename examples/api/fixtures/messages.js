var users   = require("./users");
var threads = require("./threads");

var n = 100;

module.exports = Array.apply(void 0, new Array(n)).map(function(v, i) {
  return {
    id       : "message-" + i,
    userId   : users[Math.min(users.length - 1, i)].id,
    threadId : users[Math.min(threads.length - 1, i % n)].id,
    text     : "message-" + i + " texttt"
  };
});
