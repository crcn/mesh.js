var CombinedDatabase = require("./db/combined");


/**
 */

var dbs = {
  memory   : require("./db/memory").create,
  parallel : require("./db/parallel").create,
  sequence : require("./db/sequence").create
};

/**
 */

module.exports = function(database) {

  if (arguments.length > 1) {
    database = dbs.parallel.apply(void 0, Array.prototype.apply(arguments));
  }

  return new CombinedDatabase({}, database);
}

/**
 */

module.exports.db = dbs;