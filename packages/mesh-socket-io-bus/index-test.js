var SocketIoBus  = require('./index.js');
var expect       = require('expect.js');
var ioServer     = require('socket.io');
var mesh         = require('mesh');
var server       = global.server;
var EventEmitter = require('events').EventEmitter;
var TailableBus = require('mesh-tailable-bus');
var sift        = require('sift');

describe(__filename + '#', function() {

  var port = 8899;
  var operations = [];
  var operation = {};
  var em = new EventEmitter();

  beforeEach(function() {
    if (server) server.close();
    global.server = server = ioServer(++port);

    server.on('connection', function(connection) {

      var cbus = TailableBus.create(mesh.WrapBus.create(function(op, next) {
        operation = op;

        next(void 0, op);
      }));

      SocketIoBus.create({
        client: connection
      }, cbus);

      cbus.createTail().pipeTo({
        write: function(op) {
          connection.broadcast.emit('o', op);
        },
        close: function() { },
        abort: function() { }
      });
    });
  });

  it('properly broadcasts a', function(next) {

    var iodb = SocketIoBus.create({
      host: 'http://127.0.0.1:' + port
    });

    iodb.execute({ action : 'something', data: { name: 'abba' }}).read().then(function(chunk) {
      var operation = chunk.value;
      expect(operation.action).to.be('something');
      expect(operation.data.name).to.be('abba');
      next();
    });

  });

  it('can pass remote ops', function(next) {

    var iodb2 = SocketIoBus.create({
      host: 'http://0.0.0.0:' + port
    });

    var iodb = SocketIoBus.create({
      host: 'http://127.0.0.1:' + port
    }, mesh.AcceptBus.create(sift({ action: 'insert' }), mesh.WrapBus.create(function(operation) {
      expect(operation.action).to.be('insert');
      expect(operation.data.name).to.be('abba');
      next();
    })));

    iodb2.execute({ action: 'insert', data: { name: 'abba' }});
  });
});
