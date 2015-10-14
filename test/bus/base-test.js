var Bus = require("../..").Bus;
var expect = require("expect.js")
var extend = require("../../internal/extend");

describe(__filename + "#", function() {
  it("can be created via the create() static method", function() {
    expect(Bus.create()).to.be.an(Bus);
  });

  it("copies the create() method when the bus is subclassed", function() {
    function SubBus() {

    }
    extend(Bus, SubBus);
    expect(SubBus.create()).to.be.an(Bus);
  });

  it("can extend() a base class", function() {
    expect(Bus.extend().create()).to.be.an(Bus);

    function SubClass() {

    }

    var sc = Bus.extend(SubClass).create();
    expect(sc).to.be.an(Bus);
    expect(sc).to.be.an(SubClass);

    var sc = Bus.extend({
      prop: 1
    }).create();
    expect(sc.prop).to.be(1);

  });
});
