var MLT = require('./test1/node_modules/mlt');
 
var mlt = new MLT
mlt._attribs={
    LC_NUMERIC: "es_MX" ,
    producer: "main_bin" ,
    version: "6.23.0" ,
    root: "C:/ARREOLA/Projects/KdenliveAPI/tests"
}
//mlt.push(MLT)
music = new MLT.Producer.Audio({source: '/home/jeffrey/Downloads/crazy.mp3', id:'producer0'});
mlt.push(music);

console.log(mlt.toString({pretty: true}));
// <?xml version="1.0" encoding="utf-8"?>
//
//<mlt/>
//