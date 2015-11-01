import { Bus, Response } from "mesh";
import sift from "sift";

/**
 * synchronizes operations against an array of items
 */

class CollectionBus extends Bus {

  /**
   */

  constructor(target) {
    super();
    this.target = target || [];
  }

  /**
   */

  execute(operation) {
    return Response.create((writable) => {
      switch(operation.action) {
        case "insert" : return this._insert(operation, writable)
        case "remove" : return this._remove(operation, writable)
        case "update" : return this._update(operation, writable)
        case "load"   : return this._load(operation, writable)
        default       : return writable.close();
      }
    });
  }

  /**
   */

  _insert(operation, writable) {
    this.target.push(_cloneObject(operation.data));
    writable.close();
  }

  /**
   */

  _remove(operation, writable) {
    this._find(operation).forEach((item) => {
      this.target.splice(this.target.indexOf(item), 1);
    });
    writable.close();
  }

  /**
   */

  _update(operation, writable) {
    this._find(operation).forEach((item) => {
      this.target.splice(this.target.indexOf(item), 1, operation.data);
    });
    writable.close();
  }

  /**
   */

  _load(operation, writable) {
    this._find(operation).forEach((item) => {
      writable.write(_cloneObject(item));
    });
    writable.close();
  }

  /**
   */

  _find(operation) {
    return this.target.filter(sift(operation.query));
  }
}

/**
 */

function _cloneObject(object) {
    return JSON.parse(JSON.stringify(object));
}

/**
 */

export default CollectionBus;
