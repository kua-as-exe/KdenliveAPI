import { KdeliveProject } from "../../Kdenlive";
import { Attributes, Element, ElementCompact } from "xml-js";

export interface IResource {
    attributes: Attributes,
    properties: {
        [key: string]: string
    }
}

export interface IProjectContents {
    resources: IResource[]
}

export interface IProject {
    id: string,
    name: string,
    description: string,
    progress: number,
    kdenlive?: Element | ElementCompact,
    content?: IProjectContents
}

//