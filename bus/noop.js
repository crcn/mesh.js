import Bus from "./base";
import extend from "../internal/extend";
import EmptyResponse from "../response/empty";

/**
 */

function NoopBus() { }

/**
 */

extend(Bus, NoopBus, {
  execute: function(operation) {
    return new EmptyResponse();
  }
});

/**
 */

export default NoopBus;
