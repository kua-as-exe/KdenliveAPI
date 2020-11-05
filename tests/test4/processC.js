
const compact = (mltjs) => {
  mltjs.profile = mlt.elements[0].attributes;
  delete mlt.elements[0];

  
  e.elements = e.elements.filter( elem => elem !== undefined); // filter empty elements
  return mltjs;
}

const extend = (mlt) => {
  let profileElement = {
    "name": "profile",
    "attributes": mlt
  }
  mlt.elements = [profileElement, ...mlt.elements];
  
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