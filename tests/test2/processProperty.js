const processProperty = {
    E2D: (eP) => {
      if( 
          eP.elements && 
          eP.name == 'property' && 
          eP.attributes.name &&
          eP.elements.length > 0 &&
          eP.elements[0].type == 'text'){
  
          let key = String(eP.attributes.name);
          let value = String(eP.elements[0].text);
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
export {processProperty};
