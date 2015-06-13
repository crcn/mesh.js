var words = [
  "name",
  "insert",
  "update",
  "remove",
  "load",
  "data",
  "x",
  "y",
  "rotation",
  "cid",
  "velocity",
  "resp",
  "ship",
  "bullet",
  "remote",
  "entities",
  "collection",
  "type",
  "query",
  "multi",
  "req",
  "end"
];

/**
 */

function packWord(word) {
  return words.indexOf(word);
}

/**
 */

function unpackWord(index) {
  return words[index];
}

/**
 */

var encodeUint8 = (function() {
  var arr = new Uint8Array(1);
  return function(number) {
    arr[0] = number;
    return String.fromCharCode(arr[0]);
  };
}());

var decodeUint8 = function(str, cursor, obj, propName) {
  cursor.position++;
  return str.charCodeAt(cursor.position);
};

/**
 */

var encodeFloat32 = (function() {
  var arr  = new Float32Array(1);
  var char = new Uint8Array(arr.buffer);
  return function(number) {
    arr[0] = number;
    return String.fromCharCode(char[0], char[1], char[2], char[3]);
  };
}());

/**
 */

var decodeFloat32 = (function() {
  var arr  = new Float32Array(1);
  var char = new Uint8Array(arr.buffer);
  return function(str, cursor, obj, propName) {
    for (var i = 0; i < 4; ++i) {
      char[i] = str.charCodeAt(cursor.position + i);
    }

    cursor.position += 4;

    return arr[0];
  };
}());

/**
 */

var decodeBuffer = (function() {
  return function(str, len, cursor) {

    var buffer = "";

    for (var i = 0; i < len; ++i) {
      buffer += str.charAt(cursor.position + i);
    }

    cursor.position += len;

    return buffer;
  };
}());

/**
 */

var packers = {
  data: function(data) {
    if (!data || !/ship|bullet/.test(data.type)) return data;
    var packed = {};
    var buffer = "";

    buffer = encodeFloat32(packWord(data.type)) +
    encodeFloat32(data.cid.length) +
    data.cid +
    encodeFloat32(data.x) +
    encodeFloat32(data.y) +
    encodeFloat32(data.rotation) +
    encodeFloat32(data.velocity);

    return buffer;
  },
  name: packWord,
  collection: packWord
}


var unpackers = {
  data: function(packed) {

    if (typeof packed !== "string") return packed;

    var data = {};
    var cursor = { position: 0 };

    var p = 0;

    var data = {
      type: unpackWord(decodeFloat32(packed, cursor)),
      cid: decodeBuffer(packed, decodeFloat32(packed, cursor), cursor),
      x: decodeFloat32(packed, cursor),
      y: decodeFloat32(packed, cursor),
      rotation: decodeFloat32(packed, cursor),
      velocity: decodeFloat32(packed, cursor)
    }

    return data;
  },
  name: unpackWord,
  collection: unpackWord
}



function pack(data) {

  var packed = {};

  for (var key in data) {
    var ki = words.indexOf(key);
    var value = data[key];
    packed[~ki ? ki : key] = packers[key] ? packers[key](value) : exports.pack(value);
  }

  return packed;
}

function unpack(packed) {

  var data = {};
  for (var key in packed) {

    var ki = parseInt(key);

    var nk = isNaN(ki) || ki > words.length ? key : words[ki];

    data[nk] = unpackers[nk] ? unpackers[nk](packed[key]) : exports.unpack(packed[key]);
  }

  return data;
}


exports.pack = function(data) {
  if (Object.prototype.toString.call(data) !== "[object Object]") return data;
  var p = pack(data);
  return p;
}

exports.unpack = function(packet) {
  if (Object.prototype.toString.call(packet) !== "[object Object]") return packet;
  var data = unpack(packet);
  return data;
}
