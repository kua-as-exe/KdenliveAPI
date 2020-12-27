import { DeclarationAttributes, Element, Attributes} from "xml-js";
import { Properties } from "../types";
import * as M1 from './A';

export interface KdenliveJS{
    declaration:{
        attributes: DeclarationAttributes
    }
    mlt: mlt
}

export interface project {
    profile: kdeElement
    producers: {
        [key: string]: kdeElement
    }
    main_bin: kdeElement
    timeline: kdeElement[]
}

export interface mlt {
    LC_NUMERIC: string | number
    producer: string | number
    version: string | number
    root: string | number
    elements: project
}

export interface kdeElement{
    name: string
    properties?: Properties
    attributes?: Attributes
    elements?: kdeElement[]
}

const getByName = (elemList: M1.kdeElement[], name: string, callback?: (index: number)=>{}): [M1.kdeElement, number] => {
    let index = elemList.findIndex( e => e?.name == name);
    let payload = elemList[index] || null;
    if(callback) callback(index);
    return [ payload, index ];
}
const getById = (elemList: M1.kdeElement[], id: string,  callback?: (index: number)=>{}): [M1.kdeElement, number]=> {
    let index = elemList.findIndex( e => e?.attributes?.id == id);
    let payload = elemList[index] || null;
    if(callback) callback(index);
    return [ payload, index ];
}

const B = (e: M1.KdenliveJS): KdenliveJS => {
    let mlt = e.mlt;

    const remove = (index: number) => (index >= 0)? delete mlt.elements[index]: '';

    let [ profile ] = getByName(mlt.elements, 'profile', remove )
    let [ main_bin, binIndex ] = getById(mlt.elements, 'main_bin', remove )

    let producers = {}
    // prodElements comes from profile(1) to the main_bin(binIndex)
    let prodElements = mlt.elements.slice(1, binIndex);
    prodElements.forEach( (elem, relativeIndex) => {
        let key = String(elem.attributes?.id);
        producers[key] = elem;
        remove(relativeIndex+1); // relativeIndex is from slice(1, ...) needs to add 1 to count
    })

    let timeline = mlt.elements.slice(binIndex+1)

    let elements: project = {
        profile,
        main_bin,
        producers,
        timeline,
    }

    const { LC_NUMERIC, producer, version, root } = mlt
    return {
        declaration: e.declaration,
        mlt: {
            LC_NUMERIC, producer, version, root,
            elements
        }
    };
}

const b = (e: KdenliveJS): M1.KdenliveJS => {
    let mlt = e.mlt;
    
    let elements: M1.kdeElement[] = [
        mlt.elements.profile,
        ...Object.values(mlt.elements.producers),
        mlt.elements.main_bin,
        ...mlt.elements.timeline
    ];


    const { LC_NUMERIC, producer, version, root } = mlt
    return {
        declaration: e.declaration,
        mlt: {
            LC_NUMERIC, producer, version, root,
            elements
        }
    };
}

export {B, b}