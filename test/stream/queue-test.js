var Queue = require("../../internal/stream/_queue");
var co = require("co");
var expect = require("expect.js");

describe(__filename + "function", function() {
  it("it can be created", function() {
    new Queue();
  });

  it("can enqueue & dequeue items", co.wrap(function*() {
    var q = new Queue();
    q.enqueue("a");
    q.enqueue("b");
    q.enqueue("c");
    expect(yield q.dequeue()).to.be("a");
    expect(yield q.dequeue()).to.be("b");
    expect(yield q.dequeue()).to.be("c");
  }));

  it("can wait for items to be dequeued before enqueuing", co.wrap(function*() {
    var i = 0;
    var q = new Queue();
    q.enqueue("a").then(function() {
      i++;
      q.enqueue("b").then(function() {
        i++;
        q.enqueue("c");
      });
    });

    expect(i).to.be(0);
    expect(yield q.dequeue()).to.be("a");
    expect(i).to.be(1);
    expect(yield q.dequeue()).to.be("b");
    expect(i).to.be(2);
    expect(yield q.dequeue()).to.be("c");
  }));

  it("can wait for items to be enqueued before dequeueing", co.wrap(function*() {
    var i = 0;
    var q = new Queue();
    q.dequeue().then(function(value) {
      expect(value).to.be("a");
      i++;
      q.dequeue().then(function(value) {
        expect(value).to.be("b");
        i++;
        q.dequeue().then(function(value) {
          i++;
        });
      });
    });

    yield q.enqueue("a");
    expect(i).to.be(1);
    yield q.enqueue("b");
    expect(i).to.be(2);
  }));
});
