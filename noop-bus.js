import EmptyResponse from "./empty-response";

/**
 */

function NoopBus() {
}

/**
 */

Object.assign(NoopBus.prototype, {
  execute: function(operation) {
    return new EmptyResponse();
  }
});

/**
 */

export default NoopBus;
