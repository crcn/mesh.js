var Collection = require("./base/collection");
var User       = require("./user");
var extend     = require("xtend/mutable");

/**
 */

function Users(properties) {
  Collection.call(this, properties);
}

/**
 */

extend(Threads.prototype, {
  modelClass: User
});


/**
 */

module.exports = Users;
