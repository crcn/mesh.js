import Bus from "./bus";
import extend from "./internal/extend";
import EmptyResponse from "./empty-response";

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
