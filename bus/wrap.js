import Bus from "./base";
import extend from "../internal/extend";

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

export default WrapBus;
