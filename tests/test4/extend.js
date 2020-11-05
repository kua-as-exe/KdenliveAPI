var convert = require('xml-js');
var fs = require('fs');

const processA = require('./processA');
const processB = require('./processB');
const processC = require('./processC');

var js = JSON.parse(fs.readFileSync('./test.kdenlive.json'));

js = processA.extend(js);
js = processB.extend(js);
js = processC.extend(js);

xml = convert.js2xml(js, {spaces: 1, ignoreComment: true});
fs.writeFileSync('./test.kdenlive', xml);