var convert = require('xml-js');
var fs = require('fs');

const processA = require('./processA');
const write = (file, data) => fs.writeFileSync( file, JSON.stringify(data, null, 2));

var xml = fs.readFileSync('./test.kdenlive');
var js = convert.xml2js(xml, {compact: false, spaces: 2});
// js extended

js = processA.compact(js);
write('./K.8.json', js);
// js compact 
// able to do modifications
// [...]

js = processA.extend(js);
write('./K.1.json', js);
// js extended again