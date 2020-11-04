const processProperty = {
  E2D: (e, propE, propIndex) => {
    
    let key = String(propE.attributes.name); // key
    let value = ''
    if( propE.elements && propE.elements.length > 0 && propE.elements[0] && propE.elements[0].type == 'text')
      value = String(propE.elements[0].text);

    e.properties[key] = value; // value
    delete e.elements[propIndex];
    
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
    //e.elements = [...e.elements, propertyElement];
    return propertyElement;
  }
};
const processAttribute = {
  E2D: (e, attr) => {
    if(e.attributes && e.attributes[attr]){
      e[attr] = e.attributes[attr];
      delete e.attributes[attr];
    }
  }, D2E: (e, attr) => { 
    if(e[attr]){
      e.attributes[attr] = e[attr];
      delete e[attr];
    }
  }
};
const processAttributes = {
  E2D: (e, attrs) => 
    attrs.forEach( attr => processAttribute.E2D(e, attr) ),
  D2E: (e, attrs) =>
    attrs.forEach( attr => processAttribute.D2E(e, attr) )
};
const cleanKeyIfVoid = (e, key) => {
  if(e && e[key] && Object.keys(e[key]).length == 0)
    delete e[key]; // delete key if its void
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
  //console.log("Element: ", e.name);

  delete e.type; // | e.type = "element"
  if(elementsTypesAttributes[e.name]) // move specific element.attributes to element (root)
    processAttributes.E2D(e, elementsTypesAttributes[e.name]);

  if(e.properties === undefined) e.properties = {};
  if(e.elements && e.elements.length > 0){ // if element has child elements
    e.elements.forEach( (child, index) => {
      if(child.name === 'property')
        processProperty.E2D(e, child, index); // just process the property
      else
        wrapper(child); // recurse
    });
    e.elements = e.elements.filter( elem => elem !== undefined); // filter empty elements
  }

  let keys2Clean = ['elements', 'attributes', 'properties']; // clean preprocesed keys if they are clean
  keys2Clean.forEach( key => cleanKeyIfVoid(e, key) ); // the same as up

}

const antiwrapper = (e) => {
  //console.log("Element: ", e.name);

  let keys2Recover = ['attributes', 'properties']; // create errased keys
  keys2Recover.forEach( key => {
    if(e[key] == undefined) e[key] = {};
  } ); // the same as up
  if(e.elements === undefined) e.elements = [];

  e.elements.forEach( (child, index) => {
    e.elements[index] = antiwrapper(child) // recurse
  });

  if(e.properties){
    let propElements = [];
    Object.keys(e.properties).forEach( (key) => {
      let propE = processProperty.D2E(e, key) // just process the property
      propElements.push(propE);
     })
    e.elements = [...propElements, ...e.elements];
    delete e.properties // delete "properties" key
  }

  if(elementsTypesAttributes[e.name]) // move specific element.attributes to element (root)
  processAttributes.D2E(e, elementsTypesAttributes[e.name]);
  
  if(e.elements.length == 0) delete e.elements;

  let t = {
    type: 'element',
    name: e.name,
  }
  if(e.attributes) t.attributes = e.attributes
  if(e.elements) t.elements = e.elements
  return t;
}

export const processA = {
  // js.elements[0] is the "mlt" on xml element
  E2D: (js) => {
    wrapper(js.elements[0]);
    return js;
  },
  D2E: (js) => {
    js.elements[0] = antiwrapper(js.elements[0]);
    return js;
  }
}
