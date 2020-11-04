var convert = require('xml-js');
var fs = require('fs');

const write = (file, data) => fs.writeFileSync( file, JSON.stringify(data, null, 2));

var xml = fs.readFileSync('./test.kdenlive');
var js = convert.xml2js(xml, {compact: false, spaces: 2});


import {processA} from './processA';

js = processA.E2D(js);
write('./K.8.json', js);

js = 
const customWrapper = (e) => {

  let tagsToDelete = ['properties', 'attributes', 'in', 'out'];
  tagsToDelete.forEach( tag => delete e[tag]);

  if(e.elements && e.elements.length > 0){ // if element has child elements
    e.elements.forEach( (child, index) => {
      customWrapper(child); // recurse
    });
  }
}
customWrapper(js2.elements[0]);

fs.writeFileSync('./K.9.json', JSON.stringify(js2, null, 2));


js = processA.D2E(js);
fs.writeFileSync('./K.1.json', JSON.stringify(js, null, 2));