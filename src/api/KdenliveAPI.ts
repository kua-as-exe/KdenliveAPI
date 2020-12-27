import { type } from "os";
import { Element } from "xml-js";
import { a, A, KdenliveJSA } from "./Modules/A";
import * as KdeTypes from './types'


const kde2js = (kde: Element): KdenliveJSA => {
    return A(kde);
}

const js2kde = (js: KdenliveJSA): Element => {
    return a(js);
}

const KdenliveAPI = {
    kde2js,
    js2kde
};

export { Element };
export {KdeTypes};
export default KdenliveAPI;