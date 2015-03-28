var createOperation = require("./operation");

module.exports = function(db, operationName, properties) {

  var stream = db();
  var operation;

  if (operationName.name) {
    operation = operationName;
  } else {
    operation = createOperation(operationName, properties);
  }

  process.nextTick(function() {
    stream.end(operation);
  });

  return stream;
};
