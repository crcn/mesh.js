module.exports = function(targetBus) {
  return function() {
    var busses = Array.prototype.slice.call(arguments);

    function groupBus(operation) {
      return targetBus(operation, busses);
    }


    // add mutation ops here such as push/remove

    return groupBus;
  };
};
