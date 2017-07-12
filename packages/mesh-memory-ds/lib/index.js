"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sift_1 = require("sift");
var mesh_ds_1 = require("mesh-ds");
var mongoid = require("mongoid-js");
exports.memoryDataStoreDispatcher = function (adapter) { return mesh_ds_1.dataStoreDispatcher(function () { return Promise.resolve({
    dsFind: function (_a) {
        var type = _a.type, collectionName = _a.collectionName, query = _a.query, multi = _a.multi;
        var found = (adapter.get(collectionName) || []).filter(sift_1.default(query));
        return found.length ? multi ? found : [found[0]] : [];
    },
    dsInsert: function (_a) {
        var type = _a.type, collectionName = _a.collectionName, data = _a.data;
        var ret = JSON.parse(JSON.stringify(data));
        if (!ret._id)
            ret._id = mongoid();
        ret = Array.isArray(ret) ? ret : [ret];
        if (!adapter.get(collectionName))
            adapter.set(collectionName, []);
        var collection = adapter.get(collectionName);
        collection.push.apply(collection, ret);
        adapter.set(collectionName, collection);
        return ret;
    },
    dsUpdate: function (_a) {
        var type = _a.type, collectionName = _a.collectionName, query = _a.query, data = _a.data;
        var collection = adapter.get(collectionName) || [];
        var filter = sift_1.default(query);
        var ret = [];
        for (var i = collection.length; i--;) {
            var item = collection[i];
            if (filter(item)) {
                Object.assign(item, JSON.parse(JSON.stringify(data)));
                ret.push(item);
            }
        }
        adapter.set(collectionName, collection);
        return ret;
    },
    dsRemove: function (_a) {
        var type = _a.type, collectionName = _a.collectionName, query = _a.query;
        var collection = adapter.get(collectionName) || [];
        var filter = sift_1.default(query);
        var ret = [];
        for (var i = collection.length; i--;) {
            var item = collection[i];
            if (filter(item)) {
                ret.push(item);
                collection.splice(i, 1);
            }
        }
        adapter.set(collectionName, collection);
        return ret;
    }
}); }); };
//# sourceMappingURL=index.js.map