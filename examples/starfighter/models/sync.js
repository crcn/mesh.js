var Base   = require("./base");
var _nonew = require("./_nonew");
var mesh   = require("mesh");
var group  = require("./group");
var sift   = require("sift");
var extend = require("xtend/mutable");

/**
*/

function Sync(properties) {
  Base.call(this, properties);
  if (!this.entities) this.entities = group();
  this._bus = mesh.attach({ collection: this.collection }, this.bus);
  this.initialize();

}

/**
*/

Base.extend(Sync, {

  /**
   */

  collection: "entities",

  /**
  */

  initialize: function() {
    this._freeze();
    this._tailInserts();
    this.load();
  },

  /**
   */

  load: function() {
    this._bus(mesh.op("load", { multi: true })).on("data", function(data) {
      data.remote = true;
      this._remoteChanges.push(mesh.op("insert", { data: data }));
    }.bind(this));
  },

  /**
  */

  update: function() {
    this._localChanges = this._diff(this._cache, this._serializeEntities());
    this._removeConflictingChanges();
    this._pushChanges();
    this._pullChanges();
    this._freeze();
  },

  /**
  */

  _pushChanges: function() {
    var changes = this._localChanges;

    // TODO - debounce this
    for (var i = changes.length; i--;) {
      var action  = changes[i][0];
      var item    = changes[i][1];

      // TODO - don't do this. Just for testing - want to ensure that ships don't
      // jump back
      if (item.type === "ship" && item.velocity > 0) {
        item.velocity = Math.max(item.velocity / 2, 0);
      }

      if (action === "insert") {
        this._bus(mesh.op(action, {
          data: item,
          resp: false
        }));
      } else {
        this._bus(mesh.op(action, {
          query: { cid: item.cid },
          data: action === "update" ? item : void 0,
          resp: false
        }));
      }
    }
  },

  /**
  */

  _pullChanges: function() {

    for (var i = 0, n = this._remoteChanges.length; i < n; i++) {
      var op = this._remoteChanges[i];

      if (op.name === "insert") {
        if (!sift({ cid: op.data.cid }, this.entities.items).length) {
          op.data.remote = true;
          this.entities.add(this.createItem(op.data));
        }
      } else {

        // TODO - maintain TS on ops - diff against cache here
        var items = sift(op.query, this.entities.items);

        if (!items.length) continue;
        if (op.name === "remove") {
          items[0].dispose();
        } else if (op.name === "update") {
          extend(items[0], op.data);
        }
      }
    }

    this._remoteChanges = [];
  },

  /**
  */

  _removeConflictingChanges: function() {

    var i;
    var j;

    // remove local changes from getting pushed
    for (i = this._remoteChanges.length; i--;) {
      var remoteOp = this._remoteChanges[i];

      if (remoteOp.name === "remove") {
        for (j = this._localChanges.length; j--;) {
          var lc    = this._localChanges[j][1];
          var rdata = remoteOp.query || remoteOp.data || {};
          if (lc.cid === rdata.cid) {
            this._localChanges.splice(j, 1);
            break;
          }
        }
      }


      if(remoteOp.name === "update") {
        var toUpdate = sift(remoteOp.query, this.entities.items).shift();

        if (toUpdate && !toUpdate.remote) {
          this._remoteChanges.splice(i, 1);
        }
      }
    }

    // for(i = this._localChanges.length; i--;) {
    //   var action = this._localChanges[i][0];
    //   var lc     = this._localChanges[i][1];
    //
    //   if (action === "update") {
    //     for (j = this._remoteChanges.length; j--;) {
    //       var remoteOp = this._remoteChanges[j];
    //       var rdata = remoteOp.query || remoteOp.data || {};
    //       if (lc.cid === rdata.cid) {
    //         this._remoteChanges.splice(j, 1);
    //         break;
    //       }
    //     }
    //   }
    // }
  },

  /**
  */

  _removeLocalChange: function(remoteOp, localChanges) {
    for (var i = localChanges.length; i--;) {
      var lc    = localChanges[i];
      var rdata = remoteOp.query || remoteOp.data || {};
      if (lc.cid === rdata.cid) {
        return localChanges.splice(i, 1);
      }
    }
  },

  /**
  */

  _tailInserts: function() {
    this._remoteChanges = [];
    this._tail = this._bus(mesh.op("tail")).on("data", function(op) {
      this._remoteChanges.push(op);
    }.bind(this));
  },

  /**
  */

  _diff: function(a, b) {
    var changes =  [];

    for (var ak in a) {

      if (!b[ak]) {
        changes.push(["remove", a[ak]]);

      } else if (_changed(b[ak], a[ak])) {
        // console.log(a[ak]);
        changes.push(["update", a[ak]]);
      }
    }

    for (var bk in b) {
      if (!a[bk]) {
        changes.push(["insert", b[bk]]);
      }
    }

    return changes;
  },

  /**
  */

  _freeze: function() {
    return this._cache = this._serializeEntities();
  },

  /**
  */

  _serializeEntities: function() {

    var data = {};
    var items = this.entities.getItems();

    for (var i = items.length; i--;) {
      var item  = items[i];
      if (item.remote) continue;
      data[item.cid] = item.toJSON();
    }

    return data;
  }
});

/**
*/

function _changed(a, b) {

  var ak = Object.keys(a);
  var bk = Object.keys(b);
  if (ak.length !== bk.length) return true;
  for (var i = ak.length; i--;) {
    var k = ak[i];

    if (a.type !== "ship" && /^(x|y)$/.test(k)) continue;

    if (a[k] !== b[k]) return true;
  }
  return false;
}

/**
*/

module.exports = _nonew(Sync);
