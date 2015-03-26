var Base       = require("./crud");
var extend     = require("deep-extend");

/**
 */

function CombinedDatabase(options, database) {
  this.options  = options;
  this.target   = database;
}

/**
 */

Base.extend(CombinedDatabase, {

  /**
   */

  run: function(operation, options, onRun) {
    options = this._mergeProps(options);
    this.target.run(operation, options, onRun || function(){});
  },

  /**
   */

  child: function(options) {
    return new CombinedDatabase(this._mergeProps(options), this.target);
  },

  /**
   */

  _mergeProps: function(options) {
    return extend({}, this.options, options);
  }
});

/**
 */

module.exports = CombinedDatabase;