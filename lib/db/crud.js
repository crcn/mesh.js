var Base = require("./base");

/**
 */

function CRUDDatabase () {
}

/**
 */

Base.extend(CRUDDatabase);

/**
 */

["insert", "update", "remove", "load"].forEach(function(operation) {
  CRUDDatabase.prototype[operation] = function(options, onRun) {

    if (typeof options === "function") {
      onRun = options;
      options = {};
    }

    if (!onRun) onRun = function() {};

    this.run(operation, options, onRun);
  }
});

/**
 */

module.exports = CRUDDatabase;