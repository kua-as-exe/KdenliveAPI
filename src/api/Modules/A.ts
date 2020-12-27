import { Attributes, DeclarationAttributes, Element } from "xml-js";
import { KdeTypes} from "../KdenliveAPI"
import { Properties } from "../types";

interface KdenliveJS{
    declaration:{
        attributes: DeclarationAttributes
    }
    mlt: mlt
}

interface mlt {
    LC_NUMERIC: string | number
    producer: string | number
    version: string | number
    root: string | number
    elements: kdeElement[]
}

interface kdeElement{
    name: string
    properties?: Properties
    attributes?: Attributes
    elements?: kdeElement[]
}

const wrap = {
    A: (e:Element): kdeElement => {
        // the new Element base
        let E: kdeElement = {
            name: e.name,
        }
        // create the properties key
        let properties={};
        // move the properties element tags to the properties object
        if(e.elements){
            e.elements.forEach((child, index) => {
                if(child.name == 'property'){
                    let key = String(child.attributes.name);
                    let value = '' // some properties are void, if that case, the child "text element" will not exists
                    if(child.elements && child.elements[0].text)
                        value = String(child.elements[0].text);
                    properties[key] = value;
                    delete e.elements[index];
                }
            })
            e.elements = e.elements.filter(e => e !== null); // filter the "null" values after delete.elements[index]
            E.elements = e.elements?.map(wrap.A) || [];
            if(E.elements.length == 0) delete E.elements; // clean up
        }
        if(e.attributes) E.attributes = e.attributes // pass the attributes if exists
        if(Object.keys(properties).length > 0) E.properties = properties; // clean up
        return E
    },
    a: (E: kdeElement): Element => {
        let elements:Element[] = E.elements?.map(wrap.a) || [];

        // move the properties object to child elements
        if(E.properties){
            let propElements: Element[] = []
            Object.keys(E.properties).forEach(key => {
                //console.log(E.properties)
                let child: Element = {
                    type: "element",
                    name: "property",
                    attributes:{
                        name: key
                    }
                };
                if(E.properties[key] !== "")
                    child.elements = [
                        {
                            type: "text",
                            text: E.properties[key]
                        }
                    ]
                propElements.push(child);
                delete E.properties[key];
            })
            elements = [...propElements, ...elements] // append all the element's properties in order before the other elements
        }
        return {
            type: 'element',
            ...E,
            elements
        }
    }
}

const A = (e: Element): KdenliveJS => {
    let attributes = e.declaration.attributes || {}
    const MLTelem = e.elements[0];
    const {LC_NUMERIC, producer, root, version} = MLTelem.attributes
    let mlt: mlt = {
        LC_NUMERIC,
        producer,
        root,
        version,
        elements: MLTelem.elements.map(wrap.A)
    }

    return {
        declaration: { attributes },
        mlt
    }
}
const a = (kde: KdenliveJS): Element => {
    const {LC_NUMERIC, producer, root, version} = kde.mlt
    let mlt: Element = {
        type: 'element',
        name: 'mlt',
        attributes: {
            LC_NUMERIC,
            producer,
            version,
            root,
        },
        elements: kde.mlt.elements.map(wrap.a)
    }

    return {
        declaration: kde.declaration,
        elements: [ mlt ]
    }
}

export {A, a}
export { KdenliveJS, kdeElement, mlt}