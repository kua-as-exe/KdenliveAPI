const extractElements = (e, list) => {
  e.elements.forEach( (child, index) => {
    if(list[child.name]){
      let key = list[child.name];
      delete child.name;
      if(e[key] === undefined) e[key] = [];
      e[key].push(child);
      delete e.elements[index];
    }
  })
  if(e.elements)
    e.elements = e.elements.filter( elem => elem !== undefined); // filter empty elements
  if(e.elements.length == 0) delete e.elements;
  return e;
}
const insertElements = (e, list) => {
    let t = {
      name,
      ...child
    }
    e.elements.push(t);
  
    Object.keys(list).forEach( specificKey => {
      let key = list[specificKey];
      if(e[key]){
        e[key].forEach( (child) => {
          pushElement({
            name: specificKey,
            ...child
          });
        })
        delete e[key];
      }
    })

}

const list = {
  producer: 'producers' ,
  playlist: 'playlists',
  tractor: 'tractors'
}

const compact = (mlt) => {
  // PROFILE elements[0]
  mlt.profile = mlt.elements[0].attributes;
  delete mlt.elements[0];

  mlt = extractElements(mlt, list)

  // GLOBAL PRODUCERS elements[1, ...(id:"main_bin")]
  
  //mlt.elements = mlt.elements.filter( elem => elem !== undefined); // filter empty elements
  return mlt;
}

const extend = (mlt) => {
  if(mlt.elements === undefined) mlt.elements = [];
  let profileElement = {
    "name": "profile",
    "attributes": mlt.profile
  }
  mlt.elements = [profileElement, ...mlt.elements];
  
  mlt = insertElements(mlt, list);
  
  return mlt;
}

module.exports = {
  // js.elements[0] is the "mlt" on xml element
  compact: (js) => {
    let mlt = js.elements[0];
    let mltjs = {
      attributes: mlt.attributes,
      elements: mlt.elements
    };
    mltjs = compact(mltjs);
    return (mltjs);
  },
  extend: (mltjs) => {
    mltjs = extend(mltjs);
    
    let js = {
      "declaration": {
        "attributes": {
          "version": "1.0",
          "encoding": "utf-8"
        }
      },
      "elements": [
        {
          "name": "mlt",
          "attributes": mltjs.attributes,
          "elements": mltjs.elements
        }
      ]
    }
    return js;
  }
}