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

extend(Users.prototype, Collection.prototype, {

  /**
   */

  modelClass: User
});

/**
 */

module.exports = Users;
