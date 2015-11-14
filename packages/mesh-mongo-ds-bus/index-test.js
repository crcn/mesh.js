var dsTestCases = require('mesh-ds-bus-test-cases');
var MongoDsBus  = require('./index');
var co          = require('co');
var expect      = require('expect.js');
var MongoClient  = require("mongodb").MongoClient;

describe(__filename + "#", function() {

  var db;
  var con;
  var host = 'mongodb://localhost:27017/mesh-test';

  before(function(next) {
    MongoClient.connect(host, function(err, connection) {
      if (err) return next(err);
      con = connection;
      next();
    });
  });

  beforeEach(function() {
    con.dropDatabase();
  });

  dsTestCases.create(MongoDsBus.create.bind(MongoDsBus, host), {
    hasCollections: true
  }).forEach(function(tc) {
      it(tc.description, tc.run);
  });
});
