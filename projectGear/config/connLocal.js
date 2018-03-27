const mongoose = require('mongoose'),  
require('dotenv').config({ path: '.env' });
let replString = "";
if (process.env.NODE_ENV == 'development') {
   replString = process.env.MONGODB_URI;
} else {
  replString = process.env.MONGODB_REPL_URI;
}
mongoose.Promise = global.Promise;
module.exports = connectionLocal = mongoose.createConnection(replString);

connectionLocal.on('connected', function() {  
  console.log('Mongoose connected to connection Local');
});

/*const mongoose = require('mongoose');

//Object holding all your connection strings
var connections = {};

exports.getDatabaseConnection = function(dbName) {

    if(connections[dbName]) {
        //database connection already exist. Return connection object
        return connections['dbName'];
    } else {
        connections[dbName] = mongoose.createConnection('mongodb://localhost:27017/' + dbName);
        return connections['dbName'];
    }       
}*/
/*
from app.js call 
*/
/*
const mconnect = require('./config/connLocal');
mconnect.on('open', function callback() {
    var collection = mconnect.db.collection('oplog.rs'); //or any capped collection
    var stream = collection.find({ns:'test.deposits',op:"i"}, {
        tailable: true,
        awaitdata: true,
        numberOfRetries: Number.MAX_VALUE
    }).stream(); 

  stream.on('data', function(val) {
     // console.log('Doc: %j',val);
     console.log ("------------------------");
     console.log(val);
     console.log ("------------------------");
  });

  stream.on('error', function(val) {
      console.log('Error: %j', val);
  });

  stream.on('end', function(){
      console.log('End of stream');
  });
});*/