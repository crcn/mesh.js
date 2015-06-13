var Model    = require("./base/model");
var extend   = require("xtend/mutable");

/**
 */

function Message(properties) {
  Model.call(this, properties);
}

/**
 */

extend(Message.prototype, Model.prototype, {

});

module.exports = Message;
