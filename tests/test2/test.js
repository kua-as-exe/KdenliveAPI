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
  E2D: (e, propE, propIndex) => {
    
    let key = String(propE.attributes.name); // key
    let value = ''
    if( propE.elements && propE.elements.length > 0 && propE.elements[0] && propE.elements[0].type == 'text')
      value = String(propE.elements[0].text);

    e.properties[key] = value; // value
    delete e.elements[propIndex];
    return e;

  }, D2E: (e, key) => {
    //if(!e.properties || !e.properties[key]) return e; //prepare for exception
    let propertyElement = {
      "type": "element",
      "name": "property",
      "attributes": {
        "name": key
      },
    }
    let value = e.properties[key];
    if(value) propertyElement.elements = [
      {
        "type": "text",
        "text": value
      }
    ]
    e.push(propertyElement)
    return e;
  }
};
const processAttribute = {
  E2D: (e, attr) => {
    if(e.attributes && e.attributes[attr]){
      e[attr] = e.attributes[attr];
      delete e.attributes[attr];
    }
    return e;
  }, D2E: (e, attr) => { 
    if(e[attr]){
      e.attributes[attr] = e[attr];
      delete e[attr];
    }
    return e;
  }
};

const processAttributes = {
  E2D: (e, attrs) => {
    attrs.forEach( attr => e = processAttribute.E2D(e, attr) );

    return e;
  }, D2E: (e, attrs) => { 
    attrs.forEach( attr => e = processAttribute.D2E(e, attr) );
    return e;
  }
};

const tryCleanKey = (e, key) => {

  if(e && e[key] && Object.keys(e[key]).length == 0)
    delete e[key]; // delete key if its void

  return e;
};

const elementsTypesAttributes = {
  entry: ['id', 'in', 'out', 'producer'],
  producer: ['id', 'in', 'out'],
  tractor: ['id', 'in', 'out', 'global_feed'],
  playlist: ['id'],
  track: ['producer', 'hide'],
  transition: ['id'],
  filter: ['id'],
}

const wrapper = (e) => {
  console.log("Element: ", e.name);

  delete e.type; // | e.type = "element"
  if(elementsTypesAttributes[e.name])
    e = processAttributes.E2D(e, elementsTypesAttributes[e.name])

  if(e.properties === undefined) e.properties = {};
  if(e.elements && e.elements.length > 0){

    e.elements.forEach( (child, index) => {
      if(child.name === 'property'){
        e = processProperty.E2D(e, child, index);
      }else
        wrapper(child)
    });

    e.elements = e.elements.filter( elem => elem !== undefined);
  }
  e = tryCleanKey(e, 'elements');
  e = tryCleanKey(e, 'attributes');
  e = tryCleanKey(e, 'properties');
}
var js = convert.xml2js(xml, {compact: false, spaces: 2});
console.log(js)
wrapper(js.elements[0]);
//console.log(js.elements[0].elements[1])
fs.writeFileSync('./K.7.json', JSON.stringify(js, null, 2));