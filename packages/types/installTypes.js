// Install data models
'use strict';

const dt = require('@cboyke/demotools');

const config = require('./types');

// Just delete and re-create.  
// TODO: Update existing
//
async function redoType(type) {
  let result = await dt.getType(type.key);
  let deleteOK = true;
  if(result) {
    let version = result.body.version;
    deleteOK = await dt.deleteType(type.key,version);
  }
  if(deleteOK) {
    await dt.createType(type);
  }  
}

async function main() {
    for(let t of config.types) {
      try {
        await redoType(t);
      } catch(err) {
        console.log(err);
      }
    }
}

main();