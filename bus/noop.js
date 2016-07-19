var Bus = require('./base');
var EmptyResponse = require('../response/empty');

/**
 */

function NoopBus() { }

/**
 */

 Bus.extend(NoopBus, {

  /**
   */

  execute: function (action) {
    return EmptyResponse.create();
  }
});

/**
 */

module.exports =  NoopBus;
