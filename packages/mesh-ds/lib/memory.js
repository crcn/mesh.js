"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sift_1 = require("sift");
var base_1 = require("./base");
var core_1 = require("@tandem/mesh/core");
var mongoid = require("mongoid-js");
var MemoryDataStore = (function (_super) {
    __extends(MemoryDataStore, _super);
    function MemoryDataStore() {
        var _this = _super.call(this) || this;
        _this._data = {};
        return _this;
    }
    MemoryDataStore.prototype.dsFind = function (_a) {
        var type = _a.type, collectionName = _a.collectionName, query = _a.query, multi = _a.multi;
        var found = this.getCollection(collectionName).filter(sift_1.default(query));
        return core_1.DuplexStream.fromArray(found.length ? multi ? found : [found[0]] : []);
    };
    MemoryDataStore.prototype.dsInsert = function (_a) {
        var type = _a.type, collectionName = _a.collectionName, data = _a.data;
        var ret = JSON.parse(JSON.stringify(data));
        if (!ret._id)
            ret._id = mongoid();
        ret = Array.isArray(ret) ? ret : [ret];
        (_b = this.getCollection(collectionName)).push.apply(_b, ret);
        return core_1.DuplexStream.fromArray(ret);
        var _b;
    };
    MemoryDataStore.prototype.dsRemove = function (_a) {
        var type = _a.type, collectionName = _a.collectionName, query = _a.query;
        var collection = this.getCollection(collectionName);
        var filter = sift_1.default(query);
        var ret = [];
        for (var i = collection.length; i--;) {
            var item = collection[i];
            if (filter(item)) {
                ret.push(item);
                collection.splice(i, 1);
            }
        }
        return core_1.DuplexStream.fromArray(ret);
    };
    MemoryDataStore.prototype.dsUpdate = function (_a) {
        var type = _a.type, collectionName = _a.collectionName, query = _a.query, data = _a.data;
        var collection = this.getCollection(collectionName);
        var filter = sift_1.default(query);
        var ret = [];
        for (var i = collection.length; i--;) {
            var item = collection[i];
            if (filter(item)) {
                Object.assign(item, JSON.parse(JSON.stringify(data)));
                ret.push(item);
            }
        }
        return core_1.DuplexStream.fromArray(ret);
    };
    MemoryDataStore.prototype.getCollection = function (collectionName) {
        return this._data[collectionName] || (this._data[collectionName] = []);
    };
    return MemoryDataStore;
}(base_1.BaseDataStore));
exports.MemoryDataStore = MemoryDataStore;
//# sourceMappingURL=memory.js.map