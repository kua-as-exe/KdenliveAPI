var convert = require('xml-js');

const specificElements = {
  entry: 'entries' ,
  track: 'tracks',
  transition: 'transitions',
  filter: 'filters'
}

const compact = (e) => {
  function processSpecificElement(child, index){
    let key = specificElements[child.name];
    delete child.name;
    if(e[key] === undefined) e[key] = [];
    e[key].push(child);
    delete e.elements[index];
  }
  // ---

  if(e.elements){
    e.elements.forEach( (child, index) =>{
      if(specificElements[child.name])
        processSpecificElement(child, index);
      else
        e.elements[index] = compact(child);
    });
    e.elements = e.elements.filter( elem => elem !== undefined); // filter empty elements
    if(e.elements.length == 0) delete e.elements;
  }
    
  return e;
}

const extend = (e) => {

  function pushSpecificElement(child, name){
    let t = {
      name,
      ...child
    }
    e.elements.push(t);
  }

  if(e.elements){
    e.elements.forEach( (child, index) => 
      e.elements[index] = extend(child)
    );
  }

  Object.keys(specificElements).forEach( specificKey => {
    let key = specificElements[specificKey];
    console.log(key);
    if(e[key]){
      if(e.elements === undefined) e.elements = [];
      e[key].forEach( (child) => {
        pushSpecificElement(child, specificKey);
      })
      delete e[key];
    }
  })
  // wtf with all the "SPECIFIC", it mess
  // sorry man, its 11:15pm and I dont have another idea.
  
  return e;
}

module.exports = {
  // js.elements[0] is the "mlt" on xml element
  compact: (js) => {
    js.elements[0] = compact(js.elements[0]);
    return js;
  },
  extend: (js) => {
    js.elements[0] = extend(js.elements[0]);
    return js;
  }
}
