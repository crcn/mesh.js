var protoclass     = require("protoclass");

/**
 */

function Database(options) {
  this.options  = options;
}

/**
 */

protoclass(Database, {

  /**
   */

  run: function(operation, options, onRun) {
  }
});

/**
 */

module.exports = Database;