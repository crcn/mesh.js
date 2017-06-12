var mesh = require('../../');
var WrapResponse = mesh.WrapResponse;
var BufferedResponse = mesh.BufferedResponse;

var fs = require('fs');
var co = require('co');
var expect = require('expect.js');

describe(__filename + '#', function() {
  it('can be created without any arguments', co.wrap(function*() {
    expect((yield WrapResponse.create().read()).done).to.be(true);
  }));

  it('can be created with a single value', co.wrap(function*() {
    expect((yield WrapResponse.create(1).read()).value).to.be(1);
  }));

  it('streams an array', co.wrap(function*() {
    var resp = WrapResponse.create([1, 2, 3]);
    expect((yield resp.read()).value).to.be(1);
    expect((yield resp.read()).value).to.be(2);
    expect((yield resp.read()).value).to.be(3);
    expect((yield resp.read()).done).to.be(true);
  }));

  it('wraps around an existing stream', co.wrap(function*() {
    var resp = WrapResponse.create(BufferedResponse.create(void 0, [1, 2, 3]));

    expect((yield resp.read()).value).to.be(1);
    expect((yield resp.read()).value).to.be(2);
    expect((yield resp.read()).value).to.be(3);
    expect((yield resp.read()).done).to.be(true);
  }));
});
