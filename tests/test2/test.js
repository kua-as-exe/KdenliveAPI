var convert = require('xml-js');
var fs = require('fs');

var xml = fs.readFileSync('./test.kdenlive');

var result1 = convert.xml2json(xml, {compact: true, spaces: 2});
var result2 = convert.xml2json(xml, {compact: false, spaces: 2});
//console.log(result1, '\n', result2);

fs.writeFileSync('./k.2.compact.json', result1);
fs.writeFileSync('./K.2.json', result2);

//import { processProperty } from './processProperty';
const processProperty = {
    E2D: (eP) => {
        if( eP.name == 'property' && eP.attributes.name){
            let key = String(eP.attributes.name);
            let value = "";
            if( eP.elements && eP.elements.length > 0 && eP.elements[0].type == 'text')
                value = String(eP.elements[0].text)
            return ({ key,  value });
        }
    }, D2E: (key, value) => {
      return ({
        "type": "element",
        "name": "property",
        "attributes": {
          "name": key
        },
        "elements": [
          {
            "type": "text",
            "text": value
          }
        ]
      })
    }
  };


const wrapper = (e) => {
    console.log("Element: ", e.name);

    if(e.properties === undefined) e.properties = {};
    if(e.elements && e.elements.length > 0){
        e.elements.forEach( (elem, index) => {
            if(elem.name === 'property'){
                let {key, value} = processProperty.E2D(elem);
                e.properties[key] = value;
                delete e.elements[index];
            }else{
                wrapper(elem)
            }
        });
        e.elements = e.elements.filter( elem => elem !== undefined);
    }
}
var js = convert.xml2js(xml, {compact: false, spaces: 2});
console.log(js)
wrapper(js.elements[0]);
console.log(js.elements[0].elements[1])
fs.writeFileSync('./K.3.json', JSON.stringify(js, null, 2));