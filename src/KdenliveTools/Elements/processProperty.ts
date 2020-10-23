import { Element } from "xml-js";
export const processProperty = {
    /*
      COMO LAS PROPIEDADES SE VEN:
  
      {
        "type": "element",
        "name": "property",
        "attributes": {
          "name": "{NOMBRE_DE_PROPIEDAD}"
        },
        "elements": [
          {
            "type": "text",
            "text": "{VALOR_DE_PROPIEDAD}"
          }
        ]
      }
  
    */
    E2D: (eP: Element) => {
      if( 
          eP.elements && 
          eP.name == 'property' && 
          eP.attributes?.name &&
          eP.elements.length > 0 &&
          eP.elements[0].type == 'text'){
  
          let key = String(eP.attributes.name);
          let value = String(eP.elements[0].text);
          return ({ key,  value });
      }
    }, D2E: (key: string, value: string): Element => {
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
  }