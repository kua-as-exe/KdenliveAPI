import { readFileSync, writeFileSync } from "fs";
import { js2xml, xml2js } from "xml-js";

var xml = readFileSync('./project.kdenlive').toString();
var js = xml2js(xml, {compact: false});

writeFileSync( './project.nocomprimir.json', JSON.stringify(js, null, 2));



writeFileSync( './project.kdenlive.json', JSON.stringify(js, null, 2));



xml = js2xml(js, {spaces: 1, ignoreComment: true});
writeFileSync('./project.kdenlive', xml);
