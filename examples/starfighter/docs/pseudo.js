var es = entities();
var s  = sync({ bus: bus, timeout: 30 });
s.push(es);

var p = player(ship());
s.push(p);

es.push(p);
es.push()

var g  = collider(es);
var vp = viewport(es);
var g  = group(es, vp, g);

timer(g, { fps: 30 }).start();
