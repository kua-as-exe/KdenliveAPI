var convert = require('xml-js');
var fs = require('fs');

const processA = require('./processA');
const processB = require('./processB');

var js = JSON.parse(fs.readFileSync('./test.kdenlive.json'));

js = processB.extend(js);
js = processA.extend(js);

xml = convert.js2xml(js, {spaces: 2, ignoreComment: true});
fs.writeFileSync('./test.kdenlive', xml);