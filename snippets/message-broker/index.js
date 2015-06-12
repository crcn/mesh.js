var mesh = require("mesh");

/**
 */

module.exports = function(workers, weights) {

  if (!weights) weights = [];
  if (!weights.length < workers.length) {
    for (var i = weights.length, n = workers.length; i < n; i++) {
      weights.push(1);
    }
  }

  var busses = {
    roundRobin : _roundRobin(workers, weights),
    least      : _least(workers, weights),
    weighted   : mesh.noop, // TODO
    fastest    : _fastest(workers, weights),
    random     : _random(workers, weights),
    parallel   : mesh.parallel(workers),
    sequence   : mesh.sequence(workers)
  }

  return function(operation) {
    var bus = busses[operation.dist] || mesh.noop;
    return bus(operation);
  };
};

/**
 */

function _roundRobin(workers, weights) {
  var i = 0;
  return function(operation) {
    return _pickByWeight(workers, weights, function(weightedArray) {
      return weightedArray[(i = i + 1 % weightedArray.length) - 1];
    })(operation);
  };
}

/**
 */

function _random(workers, weights) {
  return function(operation) {
    return _pickByWeight(workers, weights, function(weightedArray) {
      return weightedArray[Math.floor(Math.random() * weightedArray.length)];
    })(operation);
  };
}

/**
 * least connection algorithm
 */

function _least(workers, weights) {
  return mesh.stream(function(operation, stream) {

    var bus = _pickByWeight(workers, weights, function(weightedArray) {
      return weightedArray[0];
    });

    var index = workers.indexOf(bus);

    // console.log(index, weights);

    weights[index] = Math.max(weights[index] - 1, 0);

    bus(operation)
    .once("end", function() {
      weights[index]++;
    })
    .pipe(stream, { end: true });
  });
}

/**
 * TODO
 */

function _fastest(workers, weights) {
  return mesh.stream(function(operation, stream) {
    var bus = _pickByWeight(workers, weights, function(weightedArray) {
      return weightedArray[0];
    });

    var index = workers.indexOf(bus);

    var start = Date.now();

    bus(operation)
    .once("end", function() {
      weights[index] = Date.now() - start;
        console.log(weights);
    })
    .pipe(stream, { end: true });
  });
}

/**
 */

function _pickByWeight(workers, weights, pick) {

  var weightedArray = [];

  weights.forEach(function(weight, index) {
    var weights = [];
    for (var i = 0, n = weight; i < n; i++) {
      weights.push(index);
    }
    weightedArray.push(weights);
  });


  weightedArray.sort(function(a, b) {
    return a.length > b.length || (a.length === b.length && a[0] < b[0]) ? -1 : 1;
  });


  var index = pick(Array.prototype.concat.apply([], weightedArray));

  return workers[index];
}
