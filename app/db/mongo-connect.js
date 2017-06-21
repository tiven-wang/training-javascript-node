'use strict';

let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = function(oAppEnv){
  if(oAppEnv.isLocal === true){
      mongoose.connect('mongodb://localhost:27017/test');
  }else{
    if(oAppEnv.services.mlab) {
      // pivotal web services
      mongoose.connect(oAppEnv.services.mlab[0].credentials.uri);
    }else if(oAppEnv.services.mongodb) {
      // cloud foundry @SCP
      mongoose.connect(oAppEnv.services.mongodb[0].credentials.uri);
    }
  }
}
