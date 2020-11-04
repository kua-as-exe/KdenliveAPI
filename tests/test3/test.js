var convert = require('xml-js');
var fs = require('fs');

const processA = require('./processA');
const processB = require('./processB');
const write = (file, data) => fs.writeFileSync( file, JSON.stringify(data, null, 2));

var xml = fs.readFileSync('./test.kdenlive');
var js = convert.xml2js(xml, {compact: false, spaces: 2});
// js extended

js = processA.compact(js);
write('./K.a.json', js);

js = processB.compact(js);
write('./K.b.json', js);

js = processB.extend(js);
write('./K.c.json', js);

js = processA.extend(js);
write('./K.d.json', js);
// js extended again