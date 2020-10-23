import { Element } from "xml-js";
export const processElement = {
    /*
      COMO LAS PROPIEDADES SE VEN:
  
    {
        "type": "element",
        "name": "entry",
        "attributes": {
            {ATTRIBUTES}
            "producer": "producer1",
            "in": "00:00:00.000",
            "out": "00:04:00.767"
        },
        "elements": [
            {PROPERTIES}
                {
                    "type": "element",
                    "name": "property",
                    "attributes": {
                    "name": "kdenlive:id"
                    },
                    "elements": [
                        {
                            "type": "text",
                            "text": "2"
                        }
                    ]
                }
            {ELEMENTS}:
                {
                "type": "element",
                "name": "track",
                "attributes": {
                    "hide": "audio",
                    "producer": "playlist2"
                }
                },
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