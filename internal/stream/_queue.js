var extend = require('../extend');

/**
 */

function Queue() {
  this._values = [];
}

/**
 */

extend(Queue, {
  __signalWrite: function() {
  },
  __signalRead: function() {
  },
  enqueue: function(value) {
    this._values.push(value);
    this.__signalWrite();
    return new Promise((resolve, reject) => {
      this.__signalRead = () => {
        this.__signalRead = () => { };
        resolve();
      }
    });
  },
  dequeue: function() {
    this.__signalRead();

    if (!!this._values.length) {
      return Promise.resolve(this._values.shift());
    }
    return new Promise((resolve, reject) => {
      this.__signalWrite = () => {
        this.__signalWrite = () => { };
        this.dequeue().then(resolve, reject);
      };
    });
  }
});

/**
 */

module.exports = Queue;
