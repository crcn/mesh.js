var Bus = require("./base");
var extend = require("../internal/extend");

/**
*/

function WrapBus(execute) {
  this._execute = execute;
}

/**
*/

extend(Bus, WrapBus, {

  /**
   */
   
  execute: function(operation) {
    return this._execute(operation);
  }
});

/**
*/

module.exports =  WrapBus;
