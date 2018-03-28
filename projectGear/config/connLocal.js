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