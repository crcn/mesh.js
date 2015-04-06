var db = mesh.parallel(
  mesh.accept(function(operation) {

  }, "broadcast"),

  // swap args
  mesh.reject(function(operation) {

  }, "broadcast")
);
