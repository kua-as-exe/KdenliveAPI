import { readFileSync, writeFileSync } from "fs";
import { xml2js, ElementCompact, Element, js2xml, Attributes } from "xml-js";
import { parse, ParsedPath } from "path";
import { IProjectContents, IResource } from './Proyect';

const newElement = (name: string, attributes: Attributes = {}, elements: Element[] = []):Element => {
  return {
    type: "element",
    name,
    attributes,
    elements
  }
}
const newProperty = (name: string, src: any): Element => 
  newElement(
    'property', 
    { "name": name },
    [{
      "type": "text",
      "text": src
    }])


const processProperties = {
  E2D: (element: Element): IResource => {
    let attributes = Object.assign({}, element.attributes); // re-assign attributes
    let properties = {};
    
    element.elements.forEach( eP => {
        let { key, value } = processProperty.E2D(eP);
        properties[key] = value;
    });

    return ({ attributes, properties })
  }
}

const getResources = (elements: Element[]):IResource[] => {
    let cut = {from: undefined, to: undefined};
    //from profile to main_bin
    for(let i = 0; i < elements.length; i++){
        if(cut.from === undefined)
            if(elements[i].name == 'profile')
                cut.from = i+1;
        else
            if(elements[i].attributes?.id == 'main_bin'){
                cut.to = i;
                break;
            }
    }

    if(cut.from === undefined || cut.to === undefined)
        return [];

    let producersElements = elements
      .slice(cut.from, cut.to)
      .map( processProperties.E2D );
      
    return producersElements
  }

export { Element }
const xml2E = (xml) => {
    let json = xml2js(xml, {ignoreComment: true, alwaysChildren: true}); // or convert.xml2json(xml, options)

    let mlt: Element = json.elements[0];
    let elements: Element[] = mlt.elements || [];

    //let search = ( nameQuery: string) => elements.filter( e => e.name == nameQuery)
    let profile = elements.find(e => e.name === "profile").attributes;
    let resources: IResource[] = getResources(elements);
    let main_bin = processProperties.E2D( elements.find(e => e.attributes?.id === "main_bin") );
    

}

export class Kdenlive {
    path: ParsedPath;
    json: Element | ElementCompact;
    sections: {
        profiles: Element[],
        producers: Element[],
        playlists: Element[],
        tractors: Element[]
    }
    outputPath?: string;
    xml?: string;

    constructor(path: string){
        this.path = parse(path);
        this.xml = readFileSync(path, 'utf8');
        if(!this.xml) throw "File not founded"        
        

        /*  
        this.sections = {
          profiles: search('profile'), 
          producers: search('producer'),
          playlists: search('playlist'),
          tractors: search('tractor')
        }
        */

        return this;
    }
    
    addProducer( src:string, name?: string){
        let number = this.sections.producers.length;
        let id = "producer"+number

        let producer = newElement(
          'producer', 
          { id },
          [
            newProperty('resource', src),
            newProperty('kdenlive:id', number),
          ]
        )

        if(name) producer.elements?.push(newProperty('kdenlive:clipname', name))

        this.sections.producers.push(producer)
        
        this.sections.playlists.map( (element) => {
            if(element.attributes && element.attributes.id == 'main_bin') {
                element.elements?.push(
                    newElement('entry', {producer: id}))
            };          
            return element
        })
        return this
    }

    getProjectJSON = () => this.json;
    getElements = () => {
      let mlt: Element = this.json.elements[0];
      return mlt.elements || [];
    }

    

    getKdenliveJSON(){
      let newKdenliveJSON = this.json;
      let mlt: Element = this.json.elements[0]
      mlt.elements = [];
      this.sections.profiles.forEach( (profile) => mlt.elements?.push(profile) )
      this.sections.producers.forEach( (profile) => mlt.elements?.push(profile) )
      this.sections.playlists.forEach( (profile) => mlt.elements?.push(profile) )
      this.sections.tractors.forEach( (profile) => mlt.elements?.push(profile) )
      
      newKdenliveJSON.elements[0] = mlt;
      console.log(newKdenliveJSON);
      return newKdenliveJSON
    }

    save(){

        this.xml = js2xml(this.getKdenliveJSON());
        console.log("XML: ", this.xml);
        //this.outputPath = `${this.path.name}.processed${this.path.ext}`;
        this.outputPath = `${this.path.dir}/${this.path.name}${this.path.ext}`;
        writeFileSync(this.outputPath, this.xml.toString());
        return this;
    }

}