var SocketIoBus  = require('./index.js');
var expect       = require('expect.js');
var ioServer     = require('socket.io');
var mesh         = require('mesh');
var server       = global.server;
var EventEmitter = require('events').EventEmitter;
var TailableBus = require('mesh-tailable-bus');
var sift        = require('sift');

describe(__filename + '#', function() {

  var port = 9300;
  var actions = [];
  var action = {};
  var em = new EventEmitter();

  beforeEach(function() {
    if (server) server.close();
    global.server = server = ioServer(++port);

    server.on('connection', function(connection) {

      var cbus = TailableBus.create(mesh.WrapBus.create(function(op, next) {
        action = op;

        next(void 0, op);
      }));

      var rbus = SocketIoBus.create({
        client: connection
      }, cbus);

      cbus.createTail().pipeTo({
        write: function(op) {
          connection.broadcast.emit('o', { type: 'execute', data: op });
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

    iodb.execute({ type: 'something', data: { name: 'abba' }}).read().then(function(chunk) {
      var action = chunk.value;
      expect(action.type).to.be('something');
      expect(action.data.name).to.be('abba');
      next();
    });

  });

  it('can pass remote ops', function(next) {

    var iodb2 = SocketIoBus.create({
      host: 'http://0.0.0.0:' + port
    });

    var iodb = SocketIoBus.create({
      host: 'http://127.0.0.1:' + port
    }, mesh.AcceptBus.create(sift({ type: 'insert' }), mesh.WrapBus.create(function(action) {
      expect(action.type).to.be('insert');
      expect(action.data.name).to.be('abba');
      next();
    })));

    iodb2.execute({ type: 'insert', data: { name: 'abba' }});
  });
});
