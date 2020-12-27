import { Attributes, DeclarationAttributes } from "xml-js";
import {Element, KdeTypes} from "../KdenliveAPI"

export interface KdenliveJSA{
    declaration:{
        attributes: DeclarationAttributes,
    }
    mlt: ElementA
}

interface ElementA{
    type: "element" | "text"
    name: string
    properties?: KdeTypes.Properties
    attributes?: Attributes
    text?: string | number | boolean
    elements?: ElementA[]
}

const wrap = {
    A: (e:Element): ElementA => {
        let elements = e.elements.map(wrap.A);
        return {
            type: 'element',
            text: e.text,
            name: e.name,
            properties: {},
            attributes: e.attributes || {},
            elements: elements,
        }
    },
    a: (E: ElementA): Element => {
        let elements = E.elements.map(wrap.a);
        return {
            elements,
            ...E
        }
    }
}

const A = (e: Element): KdenliveJSA => {
    let attributes = e.declaration.attributes || {}
    let elements: Array<ElementA> = e.elements.map(wrap.A)
    return {
        declaration: { attributes },
        mlt: elements[0]
    }
}
const a = (kde: KdenliveJSA): Element => {
    let mlt: Element = wrap.A(kde.mlt)
    return {
        declaration: kde.declaration,
        elements: [ mlt ]
    }
}

export {A, a}