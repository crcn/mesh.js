
module.exports = function(targetBus) {
  return function() {

    var busses = [];
    var sorted = [];

    Array.prototype.slice.call(arguments).forEach(addBus);

    function sort() {
      sorted = sorted.sort(function(a, b) {
        return a.priority > b.priority ? 1 : -1;
      });
      busses = sorted.map(function(item) {
        return item.bus;
      });
    }

    function groupBus(operation) {
      return targetBus(operation, busses);
    }

    function addBus(bus, priority) {

      sorted.push({
        bus      : bus,
        priority : priority || busses.length
      });

      sort();
    }

    function removeBus(bus) {
      var i = busses.indexOf(bus);

      if (~i) {
        busses.splice(i, 1);
        return true;
      }

      return false;
    }

    groupBus.add    = addBus;
    groupBus.remove = removeBus;

    // add mutation ops here such as push/remove

    return groupBus;
  };
};
