
const compact = (mltjs) => {
  
  return mltjs;
}

const extend = (mltjs) => {

  
  return mltjs;
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