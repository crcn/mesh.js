var WritableStream = require('../../stream/writable');
var co = require('co');
var expect = require('expect.js');
var timeout = require('../utils/timeout');

describe(__filename + '#', function() {
  it('can be created', function() {
    WritableStream.create();
  });

  it('can write & read chunks from the stream', co.wrap(function*() {
    var w = WritableStream.create();
    var r = w.getReader();
    var chunks = [];
    r.read().then(chunks.push.bind(chunks));
    w.write('a');
    yield timeout(0);
    expect(chunks[0].value).to.be('a');
  }));

  it('can abort a stream with a reason', co.wrap(function*() {
    var w = WritableStream.create();
    var r = w.getReader();
    w.write('a');
    yield r.read();
    w.abort(new Error('an error'));

    var err;

    try {
      yield r.read();
    } catch(e) {
      err = e;
    }

    expect(err.message).to.be('an error');
  }));

  it('aborts the stream even after chunks have been written', co.wrap(function*() {
    var w = WritableStream.create();
    var r = w.getReader();
    w.write('a');
    w.abort(new Error('an error'));
    var err;
    try {
      yield r.read();
    } catch(e) {
      err = e;
    }
    expect(err.message).to.be('an error');
  }));

  it('reads all the chunks from the stream until there are no more', co.wrap(function*() {
    var w = WritableStream.create();
    var r = w.getReader();
    w.write('a');
    w.write('b');
    w.write('c');
    w.close();

    var buffer = [];
    var chunk;
    while((chunk = yield r.read()) && !chunk.done) {
      buffer.push(chunk.value);
    }

    expect(buffer.join('')).to.be('abc');
  }));

  it('calls then() after the write stream has ended', co.wrap(function*() {
    var w = WritableStream.create();
    var r = w.getReader();
    w.write('a');
    w.write('b');

    var i = 0;
    w.then(function() {
      i++;
    });

    w.close();

    // then() won't get called until read() is called entirely
    yield r.read();
    yield r.read();
    yield r.read();
    yield timeout(10);
    expect(i).to.be(1);
  }));

  it('returns an error when trying to write to a closed stream', co.wrap(function*() {
    var w = WritableStream.create();
    w.close();
    var err;
    try {
      yield w.write('chunk');
    } catch(e) {
      err = e;
    }
    expect(err.message).to.be('cannot write to a closed stream');
  }));

  it("calls then() immediately after close()", function(next) {
    var w = WritableStream.create();
    w.then(function() {
      next();
    });
    w.write('chunk');
    w.close();
  });
});
