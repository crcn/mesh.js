
module.exports = function(targetBus) {
  return function() {

    var busses = [];
    var sorted = [];

    Array.prototype.slice.call(arguments).forEach(add);

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

    function add(bus, priority) {

      sorted.push({
        bus      : bus,
        priority : priority || busses.length
      });

      sort();
    }

    function remove(bus) {
      var i = busses.indexOf(bus);

      if (~i) {
        busses.splice(i, 1);
        sorted.splice(i, 1);
        return true;
      }

      return false;
    }

    groupBus.add    = add;
    groupBus.remove = remove;

    return groupBus;
  };
};
