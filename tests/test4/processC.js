const processTractor = (mlt) => {
  let endTractor = mlt.elements[mlt.elements.length-1]; 

  const processProducer = (id) => {
    let prodElement = mlt.elements.find( (e, index) => e.id === id);  
    if(prodElement.name === "producer"){
      // return ready
    }else if(prodElement.name === "playlist"){
      // entries
    }else if(prodElement.name === "tractor"){
      // tracks
    }
  }

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
  mlt.producers = [];
  let main_binIndex = 1;
  for(let i = 1; i <= mlt.elements.length; i++){
    let child = mlt.elements[i];
    if(child.id === "main_bin"){
      main_binIndex = i;
      break; // stop when find main_bin
    }
    else{
      mlt.producers.push(child);
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