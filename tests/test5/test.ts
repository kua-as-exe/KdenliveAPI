import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { Element, js2xml, xml2js } from "xml-js";
import KdenliveAPI from "../../src/api/KdenliveAPI";

const path = './tests/test5/'

var xml = readFileSync(join(path, 'project.bak.kdenlive')).toString();
var js = (<Element>xml2js(xml, {compact: false}));

writeFileSync(join(path, './project.nocomprimir.json'), JSON.stringify(js, null, 2));

let kdejs = KdenliveAPI.kde2js(js);

writeFileSync(join(path, './project.json'), JSON.stringify(kdejs, null, 2));

js = KdenliveAPI.js2kde(kdejs);

writeFileSync(join(path, './project.back.json'), JSON.stringify(js, null, 2));

xml = js2xml(js, {spaces: 1, ignoreComment: true});
writeFileSync(join(path, './project.kdenlive'), xml);
