var convert = require('xml-js');
var fs = require('fs');

const processA = require('./processA');
const processB = require('./processB');

var xml = fs.readFileSync('./test.kdenlive');
var js = convert.xml2js(xml, {spaces: 2});

js = processA.compact(js);
js = processB.compact(js);

var json = JSON.stringify(js, null, 2);
fs.writeFileSync( './test.kdenlive.json', json);