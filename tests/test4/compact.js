var convert = require('xml-js');
var fs = require('fs');

const processA = require('./processA');
const processB = require('./processB');
const processC = require('./processC');

var xml = fs.readFileSync('./../test.kdenlive');
var js = convert.xml2js(xml, {spaces: 2});
var json = JSON.stringify(js, null, 2);
fs.writeFileSync( './test.kdenlive.nocomprimir.json', json);
//console.log("JSON", js)

js = processA.compact(js);
js = processB.compact(js);
js = processC.compact(js);

var json = JSON.stringify(js, null, 2);
fs.writeFileSync( './test.kdenlive.json', json);