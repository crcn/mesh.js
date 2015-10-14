var Bus = require('./base');
var extend = require('../internal/extend');
var EmptyResponse = require('../response/empty');

/**
 */

function NoopBus() { }

/**
 */

extend(Bus, NoopBus, {

  /**
   */

  execute: function(operation) {
    return new EmptyResponse();
  }
});

/**
 */

module.exports =  NoopBus;
