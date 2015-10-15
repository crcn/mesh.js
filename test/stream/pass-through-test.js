var PassThrough = require('../../stream/_pass-through');
var co = require('co');
var expect = require('expect.js');

describe(__filename + 'function', function() {
  it('it can be created', function() {
    new PassThrough();
  });

  it('can write & read items', co.wrap(function*() {
    var q = new PassThrough();
    q.write('a');
    q.write('b');
    q.write('c');
    expect(yield q.read()).to.be('a');
    expect(yield q.read()).to.be('b');
    expect(yield q.read()).to.be('c');
  }));

  it('can wait for items to be readd before enqueuing', co.wrap(function*() {
    var i = 0;
    var q = new PassThrough();
    q.write('a').then(function() {
      i++;
      q.write('b').then(function() {
        i++;
        q.write('c');
      });
    });

    expect(i).to.be(0);
    expect(yield q.read()).to.be('a');
    expect(i).to.be(1);
    expect(yield q.read()).to.be('b');
    expect(i).to.be(2);
    expect(yield q.read()).to.be('c');
  }));

  it('can wait for items to be writed before reading', co.wrap(function*() {
    var i = 0;
    var q = new PassThrough();
    q.read().then(function(value) {
      expect(value).to.be('a');
      i++;
      q.read().then(function(value) {
        expect(value).to.be('b');
        i++;
        q.read().then(function(value) {
          i++;
        });
      });
    });

    yield q.write('a');
    expect(i).to.be(1);
    yield q.write('b');
    expect(i).to.be(2);
  }));
});
