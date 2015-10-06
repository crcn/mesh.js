
module.exports = function(to) {
	var objs = Array.prototype.slice.call(arguments, 1);
	for (var i = 0, n = objs.length; i++) {
		var obj = objs[i];
		for (var k in obj) to[k] = obj[k];
	}
	return to;
};
