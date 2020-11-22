const childsIDs = {
  tractor: 'tracks',
  playlist: 'entries'
}

const processTractor = (mlt) => {

  const processElement = (id) => {
    let elemID = mlt.elements.findIndex( (e, index) => e && e.id === id);  
    if(elemID === -1) return undefined;

    let elem = mlt.elements[elemID]; // ahuevo get the element

    // recurse
    if(elem.name === "producer"){ // if producer
      let producerID = elem.properties['kdenlive:id'];
      if(mlt.producers[producerID]){ // check if exist a global producer
        elem.refID = producerID;
        let global = mlt.producers[elem.refID];
        Object.keys(global.properties).forEach( key => {
          if(elem.properties[key] === global.properties[key]){
            delete elem.properties[key];
          }
        })

        delete elem.id; // removeID could change if elements are added
      }else { // if not lol
        // nothing to do xde
      }
      // its better to generate the ID's from expanding process

    }else{ // if tractor or playlist
      let childsKey = childsIDs[elem.name];
      if(elem[childsKey]){
        elem[childsKey].forEach( (childProd, childIndex) => {
          elem[childsKey][childIndex] = processElement(childProd.producer)
        })
      }
    }
    //delete elem.id;
    delete mlt.elements[elemID];
    return elem;
  }

  let endTractor = mlt.elements[mlt.elements.length-1]; 
  mlt.timeline = processElement(endTractor.id);

  mlt.elements = mlt.elements.filter( elem => elem !== undefined); // filter empty elements
  if(mlt.elements.length == 0) delete mlt.elements;

  // find the equivalent globalProducer
  /*
  let globalProducer;
  if(mlt.producers && mlt.producers > 0)
    globalProducer = mlt.producers.find( p => p.id === id);
  */
  
  return mlt;
}

const compact = (mlt) => {
  // PROFILE elements[0]
  mlt.profile = mlt.elements[0].attributes;
  delete mlt.elements[0];

  // GLOBAL PRODUCERS elements[1, ...(id:"main_bin")]
  mlt.producers = {};
  let main_binIndex = 1;
  for(let i = 1; i <= mlt.elements.length; i++){
    let child = mlt.elements[i];
    if(child.id === "main_bin"){
      main_binIndex = i;
      break; // stop when find main_bin
    }
    else{
      childID = child.properties['kdenlive:id'];
      delete child.id; // remove id because its relative and could be generated on extend process
      mlt.producers[childID] = child;
      delete mlt.elements[i];
    }
  }

  // main_bin
  mlt.main_bin = mlt.elements[main_binIndex]; // copy elements[main_bin] to mlt.main_bin
  delete mlt.elements[main_binIndex]; // remove mlt.elements[main_bin]
  delete mlt.main_bin.name // mlt.main_bin.name = "playlist"
 
  // processing tractors
  mlt = processTractor(mlt)
  /*
  for(let i = mlt.elements.length-1; i > 0; i --){
    let e = mlt.elements[i];
    if(e.name === "tractor"){
      let tractor = e;
      tractor.tracks.forEach( track => {
        let {producer, index} = getProducer(mlt, track.producer)
      })
    }
  }
  */


  //mlt.elements = mlt.elements.filter( elem => elem !== undefined); // filter empty elements
  return mlt;
}

const extend = (mlt) => {
  if(mlt.elements === undefined) mlt.elements = [];
  let profileElement = {
    "name": "profile",
    "attributes": mlt.profile
  }
  mlt.elements = [profileElement, ...mlt.elements];
  
  //mlt = insertElements(mlt, list);
  
  return mlt;
}

module.exports = {
  // js.elements[0] is the "mlt" on xml element
  compact: (js) => {
    let mlt = js.elements[0];
    let mltjs = {
      attributes: mlt.attributes,
      elements: mlt.elements
    };
    mltjs = compact(mltjs);
    return (mltjs);
  },
  extend: (mltjs) => {
    mltjs = extend(mltjs);
    
    let js = {
      "declaration": {
        "attributes": {
          "version": "1.0",
          "encoding": "utf-8"
        }
      },
      "elements": [
        {
          "name": "mlt",
          "attributes": mltjs.attributes,
          "elements": mltjs.elements
        }
      ]
    }
    return js;
  }
}