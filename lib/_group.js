
module.exports = function(targetBus) {
  return function(/*...busses*/) {

    var busses = [];
    var sorted = [];

    add.apply(void 0, Array.prototype.slice.call(arguments));

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

    function add(/*...*/ busses, priority) {

      var busses   = Array.prototype.slice.call(arguments);
      var priority = typeof busses[busses.length - 1] === "number" ? busses.pop() : void 0;

      busses.forEach(function(bus) {
        sorted.push({
          bus      : bus,
          priority : priority || sorted.length
        });
      });

      sort();
    }

    function remove(bus) {
      var i = busses.indexOf(bus);

      if (!!~i) {
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
