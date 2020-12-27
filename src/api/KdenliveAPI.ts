import { type } from "os";
import { Element } from "xml-js";
import * as M1 from "./Modules/A";
import * as M2 from "./Modules/B";
import * as KdeTypes from './types'


const kde2js = (data: Element): M2.KdenliveJS => {
    return M2.B(M1.A(data));
}

const js2kde = (data: M2.KdenliveJS): Element => {
    return M1.a(M2.b(data));
}

const KdenliveAPI = {
    kde2js,
    js2kde
};

export { Element };
export {KdeTypes};
export default KdenliveAPI;