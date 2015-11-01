var EventEmitter = require('events').EventEmitter;
var extend = require('../../internal/extend');
var mesh = require('../..');
var Bus = mesh.Bus;
var Response = mesh.Response;

/**
*/

function FlowMapBus(delay, bus, args) {
  EventEmitter.call(this);
  this.delay   = delay;
  this.target  = bus;
  this.args    = args;
}

extend(EventEmitter, FlowMapBus, {
  execute(operation) {

    if (!operation) operation = {};

    if (!operation.flowPath) {
      operation.flowPath = [];
    }

    var flowPart = {
      wrapper : this,
      chunks  : []
    };

    operation.flowPath.push();

    this.emit('execute', this, operation);
    return Response.create((writable) => {
      this.target.execute(operation).pipeTo({
        write: (chunk) => {
          this.emit('chunk', chunk);
          setTimeout(writable.write.bind(writable), this.delay, chunk);
        },
        close: () => {
          writable.close();
        },
        abort: (error) => {
          flowPart.error = error;
          writable.abort(error);
        }
      });
    });
  }
});

/*
var vis = FlowMapper.create();

*/

function FlowMapper() {
  EventEmitter.call(this);
  this.busses = [];
  this.delay  = 100;
}

extend(EventEmitter, FlowMapper, {
  wrapBusFactory(busClass) {
    var self = this;
    return {
      create: function() {
        var args = Array.prototype.slice.call(arguments);
        var bus = busClass.create.apply(busClass, args);
        var wrapper = new FlowMapBus(self.delay, bus, args);
        self.busses.push(wrapper);
        self.emit('addedBus');
        return wrapper;
      }
    }
  }
});

module.exports = FlowMapper;
