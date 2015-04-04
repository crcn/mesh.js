var db = crud.parallel(
  crud.accept(function(operation) {

  }, "broadcast"),

  // swap args
  crud.reject(function(operation) {

  }, "broadcast")
);
