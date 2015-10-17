var WritableStream = require('../../stream/writable');
var co = require('co');
var timeout = require('../utils/timeout');
var expect = require('expect.js');

describe(__filename + "#", function() {
  it('can pipe chunks to a writable', co.wrap(function*() {
    var w = WritableStream.create();
    var r = w.getReader();
    var chunks = [];
    var doneCalled = false;
    r.pipeTo({
      write: chunks.push.bind(chunks),
      close: function() {
        doneCalled = true;
      },
      abort: function(error) {

      }
    });
    w.write('a');
    w.write('b');
    w.write('c');
    w.close();
    yield timeout(0);
    expect(chunks.join('')).to.be('abc');
    expect(doneCalled).to.be(true);
  }));

  it('passes abort', co.wrap(function*() {
    var w = WritableStream.create();
    var r = w.getReader();
    var chunks = [];
    var doneCalled = false;
    var error;
    r.pipeTo({
      write: chunks.push.bind(chunks),
      end: function() {
        doneCalled = true;
      },
      abort: function(err) {
        error = err;
      }
    });
    w.write('a');
    w.write('b');
    w.write('c');
    w.abort(new Error('aborted'));
    yield timeout(0);
    expect(error.message).to.be('aborted');
    expect(chunks.join('')).to.be('a');
  }));

  it('can prevent closure on a writable', co.wrap(function*() {
    var w = WritableStream.create();
    var r = w.getReader();
    var doneCalled = false;
    var chunks = [];
    r.pipeTo({
      write: chunks.push.bind(chunks),
      close: function() {
        doneCalled = true;
      },
      abort: function(err) {
        error = err;
      }
    }, { preventClose: true });
    w.write('a');
    w.write('b');
    w.close();
    yield timeout(0);
    expect(chunks.join('')).to.be('ab');
    expect(doneCalled).to.be(false);
  }));

  xit('waits for piped wait() to resolve if there\'s a promise');
  xit('automatically closes if there\'s an error while writing to a piped stream');
});
