const fs = require('fs');
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');
const pub = redis(6379, 'localhost');
const sub = redis(6379, 'localhost');
const passportSocketIo = require("passport.socketio");
const http = require('http');
const https = require('https');
require('events').EventEmitter.defaultMaxListeners = 13;
require('dotenv').config({ path: '.env' });
let replString = "";
if (process.env.NODE_ENV == 'development') {
   replString = process.env.MONGODB_LOCAL;
} else {
   replString = process.env.MONGODB_REPL_LOCAL;
}
module.exports = function(app, passport, sessionStore , cookieParser ){
	/* var server = https.createServer({
	    key: fs.readFileSync('./public/ssl/23gaming.key'),
	    cert: fs.readFileSync('./public/ssl/23gaming.crt'),
	    //ca: fs.readFileSync('./test_ca.crt'),
	    //requestCert: false,
	    //rejectUnauthorized: false
	  },app);*/

	   // var server = https.createServer({
	   //  key: fs.readFileSync('./public/ssl/dota2bestyolo.key'),
	   //  cert: fs.readFileSync('./public/ssl/dota2bestyolo.crt'),
	    //ca: fs.readFileSync('./test_ca.crt'),
	    //requestCert: false,
	    //rejectUnauthorized: false
	  // },app);

	  /*var server = https.createServer({
	    key: fs.readFileSync('./public/testssl/privkey1.pem','utf8'), // this is privkey
	    cert: fs.readFileSync('./public/testssl/fullchain1.pem','utf8'), // this is fullchain
	    ca: fs.readFileSync('./public/testssl/chain1.pem','utf8')
	    //requestCert: false,
	    //rejectUnauthorized: false
	  },app);*/

	  /*var server = https.createServer({
	    key: fs.readFileSync('./public/testssl_demo/privkey1.pem','utf8'), // this is privkey
	    cert: fs.readFileSync('./public/testssl_demo/fullchain1.pem','utf8'), // this is fullchain
	    ca: fs.readFileSync('./public/testssl/chain1.pem','utf8')
	    //requestCert: false,
	    //rejectUnauthorized: false
	  },app);*/
	  /*var server = https.createServer({
	    key: fs.readFileSync('./public/sslcase188/privkey1.pem','utf8'), // this is privkey
	    cert: fs.readFileSync('./public/sslcase188/fullchain1.pem','utf8'), // this is fullchain
	    ca: fs.readFileSync('./public/sslcase188/chain1.pem','utf8')
	    //requestCert: false,
	    //rejectUnauthorized: false
	  },app);*/
	const server = http.createServer(app);
    
    const io = require('socket.io')(server, {
	    serveClient: false,
	    pingInterval: 10000,
	    pingTimeout: 5000,
	    transports: ['websocket'],
	});
    /*let pubClient = redis(config.redis.port, config.redis.host, {
		auth_pass: config.redis.password
	});
	let subClient = redis(config.redis.port, config.redis.host, {
		return_buffers: true,
		auth_pass: config.redis.password
	});*/
    io.adapter(adapter({ pubClient: pub, subClient: sub }));

    io.use(passportSocketIo.authorize({
	    key: 'connect.sid',
	    secret: process.env.SESSION_SECRET,
	    store: sessionStore,
	    passport: passport,
	    cookieParser: cookieParser,
	    success:      onAuthorizeSuccess,  // *optional* callback on success
	    fail:         onAuthorizeFail,     // *optional* callback on fail/error
	}));


    // require('../sockets')(io);
    require('../sockets/frontend/depwid')(io, replString);
    require('../sockets/frontend/case')(io);
    require('../sockets/frontend/match')(io);
    require('../sockets/index')(io, replString);

    require('../sockets/backend/index')(io);
    require('../sockets/backend/bot')(io, replString);
    require('../sockets/backend/setting')(io);

    return server;
}

function onAuthorizeSuccess(data, accept){
      // console.log('successful connection to socket.io');
      // The accept-callback still allows us to decide whether to
      // accept the connection or not.
      accept(null, true);
}

function onAuthorizeFail(data, message, error, accept){
    if(error)
      //throw new Error(message);
    console.log('failed connection to socket.io:', message);
    // We use this callback to log all of our failed connections.
    accept(null, false);
}