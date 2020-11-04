// I need to do this stuff from scratch
// but im ready csm

const wrapper = (e) => {

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

export const processB = {
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
