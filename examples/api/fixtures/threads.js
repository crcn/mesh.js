var users = require("./users");

module.exports = Array.apply(void 0, new Array(100)).map(function(v, i) {
  return {
    id       : "thread-" + i,
    userId   : users[Math.min(users.length - 1, i)].id,
    title    : "thread-" + i + "-title"
  };
});
