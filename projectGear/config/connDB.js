acl = require('acl');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

//let replString = "mongodb://10.99.0.10:27017,10.99.0.11:27017,10.99.0.12:27017/test?replicaSet=rs1";
let replString = "";
if (process.env.NODE_ENV == 'development') {
   replString = process.env.MONGODB_URI;
} else {
  replString = process.env.MONGODB_REPL_URI;
}

let options = { 
   // useMongoClient: true,
   keepAlive: 300000, 
  // connectTimeoutMS : 120000 
  connectionTimeout: 0     
};
mongoose.Promise = global.Promise;

module.exports = connectionDB = mongoose.createConnection(replString,options);


acl.prototype.myMiddleware = function(numPathComponents, userId, actions){
  // contract(arguments)
  //   .params()
  //   .params('number')
  //   .params('number','string|number|function')
  //   .params('number','string|number|function', 'string|array')
  //   .end();

 
  var acl = this;

  function HttpError(errorCode, msg){
    this.errorCode = errorCode;
    this.message = msg;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
    this.constructor.prototype.__proto__ = Error.prototype;
  }

  return function(req, res, next){
    var _userId = userId,
    _actions = actions,
    resource,
    url;

    // call function to fetch userId
    if(typeof userId === 'function'){
      _userId = userId(req, res);
    }
    if (!userId) {
      if((req.session) && (req.session.userId)){
        _userId = req.session.userId;
      }else if((req.user) && (req.user.id)){
        _userId = req.user.id;
      }else{
        // next(new HttpError(401, 'User not authenticated'));
        // return;
       
        return res.render('error/404');
      }
    }

    // Issue #80 - Additional check
    if (!_userId) {
      // next(new HttpError(401, 'User not authenticated'));
      // return;
     
      return res.render('error/404');
    }

    url = req.originalUrl.split('?')[0];
    if(!numPathComponents){
      resource = url;
    }else{
      resource = url.split('/').slice(0,numPathComponents+1).join('/');
    }

    if(!_actions){
      _actions = req.method.toLowerCase();
    }

    acl.logger?acl.logger.debug('Requesting '+_actions+' on '+resource+' by user '+_userId):null;
    // console.log('============= _userId');
    // console.log(_userId);
    // console.log('============= resource');
    // console.log(resource);
    // console.log('============= _actions');
    // console.log(_actions);

    acl.isAllowed(_userId, resource, _actions, function(err, allowed){
      if (err){
        // console.log('============= isAllowed 11111111111111111 == error');
        return res.render('error/404');
        //next(new Error('Error checking permissions to access resource'));
      }else if(allowed === false){

        if (acl.logger) {
          // console.log('============= isAllowed 2222222222222 == acl.logger');
          acl.logger.debug('Not allowed '+_actions+' on '+resource+' by user '+_userId);
          acl.allowedPermissions(_userId, resource, function(err, obj){
            acl.logger.debug('Allowed permissions: '+util.inspect(obj));
          });
        }
        // console.log('============= isAllowed 33333333333333 == false');
        
        if(req.xhr){
          return res.send({msg: 'Insufficient permissions to access resource'});
        }else{
          return res.render('error/404');
        }
        
        //next(new HttpError(403,'Insufficient permissions to access resource'));
      }else{
        // console.log('============= isAllowed 444444444444 == true');
        acl.logger?acl.logger.debug('Allowed '+_actions+' on '+resource+' by user '+_userId):null;
        next();
      }
    });
  };
}


connectionDB.on('connected', function() {  
  console.log('Mongoose connected to connection DB');
  // node_acl.addUserRoles( '59029ca602b8fe27e0f798dd', ['feedback_view','feedback_detail','feedback_reply','feedback_delete']);

  // node_acl.removeUserRoles( '59029ca602b8fe27e0f798dd', ['feedback_view'] );

  // Generic debug logger for node_acl
  function logger() {
    return {
      debug: function( msg ) {
        console.log( '-DEBUG-', msg );
      }
    };
  }
  
});
