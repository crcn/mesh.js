var group  = require("./group");
var ship   = require("./ship");
var expect = require("expect.js");

describe(__filename + "#", function() {

  it("can create a new group without any initial items", function() {
    var g = group();
  });

  it("can add one item to the group", function() {
    var g = group();
    g.add(ship());
    expect(g.items.length).to.be(1);
  });

  it("can remove an item from the group", function() {
    var g = group();
    var s = ship();
    g.add(s);
    expect(g.items.length).to.be(1);
    g.remove(s);
    expect(g.items.length).to.be(0);
  });

  it("can remove an item twice from a group", function() {
    var g = group();
    var s = ship();
    g.add(s);
    expect(g.items.length).to.be(1);
    g.remove(s);
    expect(g.items.length).to.be(0);
    g.remove(s);
    expect(g.items.length).to.be(0);
  });

  it("updates all child elements", function() {
    var g = group();
    var i = 0;
    var j = 0;
    var s1 = { update: function() { i++;} };
    var s2 = { update: function() { j++;} };

    g.add(s1, s2);

    g.update();
    expect(i).to.be(1);
    expect(j).to.be(1);
  });

  it("adds an emitted child", function() {
    var g = group();
    var e = ship();
    g.add(e);
    expect(g.items.length).to.be(1);
    e.fire();
    expect(g.items.length).to.be(2);
  });

  it("adds an emitted child", function() {
    var g = group();
    var e = ship();
    g.add(e);
    expect(g.items.length).to.be(1);
    e.fire();
    expect(g.items.length).to.be(2);
  });

  it("removes an entity when 'dispose' is emitted", function() {

    var g = group();
    var e = ship();
    g.add(e);
    expect(g.items.length).to.be(1);
    e.dispose();
    expect(g.items.length).to.be(0);
  });

  it("resets listeners when an item is removed", function() {
    var g = group();
    var e = ship();
    g.add(e);
    expect(g.items.length).to.be(1);
    e.fire();
    expect(g.items.length).to.be(2);
    e.dispose();
    e.fire();
    expect(g.items.length).to.be(1);
  });

});
