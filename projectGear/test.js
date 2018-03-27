/***********************
 * Module dependencies.
 ************************/
 const cluster = require('cluster');
 const debug = require('debug')('webapp:server');
 const express = require('express');
 //const compression = require('compression')
 const i18n = require("i18n");
 const fs = require('fs');
 const session = require('express-session');
 const path = require('path');
 const favicon = require('serve-favicon');
 const logger = require('morgan');
 const lusca = require('lusca');
 const cookieParser = require('cookie-parser');
 const bodyParser = require('body-parser');
 const MongoStore = require('connect-mongo')(session);
 const flash = require('express-flash');
 const mongoose = require('mongoose');
 const passport = require('passport');
 const OpenIDStrategy = require('passport-openid').Strategy;
 const request = require('request');
 const expressValidator = require('express-validator');
 const methodOverride = require('method-override');
 const errorHandler = require('errorhandler');
 require('dotenv').config({ path: '.env' });
 const svgCaptcha = require('svg-captcha');
 const mconnect = require('./config/connDB');
 const passportSocketIo = require("passport.socketio");
 const passportConfig = require('./config/passport');
 const ioServer = require('./config/socket');
 var serveStatic = require('serve-static');
 const acl = require('acl');
 let node_acl = new acl(new acl.mongodbBackend(mconnect.db, 'acl_', true));
 i18n.configure({
  locales:['en', 'ru' , 'zh' , 'es'],
  directory: __dirname + '/locales',
    //define the default language
    defaultLocale: 'en',
    // define a custom cookie name to parse locale settings from
    cookie: 'i18n',
    updateFiles: false//true

  });

/**************************
 * Create Express server.
 **************************/
const app = express();
//app.use(compression());

/***************************
 * Express configuration.
 ***************************/
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
app.use(cookieParser());
//init i18n after cookie-parser
app.use(i18n.init);

app.use(expressValidator({
  customValidators: {
    gte: function(param, num) {
      return param >= num;
    },
    isNumber: function(param) {
      return !isNaN(param);
    },
    isObjectId: function(n) {
      return mongoose.Types.ObjectId.isValid(n);
    }
  }
}));

// Sets up a session store with Mongodb
var sessionStore = new MongoStore({
  mongooseConnection: mconnect,
  autoReconnect: true,
  stringify: false,
  autoRemove: 'native', // Default 
  ttl: 7 * 24 * 60 * 60, // 7 days - time to live for session cookies stored. 14 days default
  touchAfter: 1 * 60 * 60 // save to database every hour.
});

var sessionMiddleware = session({
  //name: 'id',
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  /*cookie: { 
    domain: process.env.BASE_URL, 
    //secure: true,
    path:'/',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  },*/
});

app.use(sessionMiddleware);
/*app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));*/
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload' || req.path === '/user/uploadAvatar' || req.path === '/admin/hero/create' || req.path === '/admin/hero/edit' || req.path === '/admin/rarity/create' || req.path === '/admin/rarity/edit'|| req.path === '/admin/quality/create' || req.path === '/admin/quality/edit' || req.path === '/admin/slot/create' || req.path === '/admin/slot/edit'|| req.path === '/admin/team/create' || req.path === '/admin/team/edit' || req.path === '/admin/tournament/create' || req.path === '/admin/tournament/edit' || req.path === '/admin/player/create' || req.path === '/admin/player/edit' || req.path == '/admin/tournament/allteams' || req.path === '/admin/dota2/create' || req.path === '/admin/dota2/edit' || req.path === '/admin/dota2/edit2' || req.path === '/user/feedback' || req.path === '/admin/blog/create' || req.path === '/admin/blog/edit' || req.path === '/event/detail/countRead' || req.path === '/admin/slider/create' || req.path === '/admin/slider/edit' || req.path === '/admin/csgo/create' || req.path === '/admin/csgo/edit' || req.path === '/admin/csgo/edit2' || req.path === '/user/feedbackajax' || req.path === '/sysmessage/updatestatus' || req.path ==='/admin/inventory/dota2/deleteMultiItem' || req.path == '/admin/blog/create' || req.path == '/admin/blog/createImage' || req.path ==='/feedback/detail/reply' || req.path ==='/user/clearNotification' || req.path === '/admin/setting/saveFbImg' || req.path === '/admin/case/dota2/create' || req.path === '/admin/case/dota2/edit' || req.path === '/admin/case/updateItemStatus' || req.path === '/admin/case/csgo/create' || req.path === '/admin/case/csgo/edit' || req.path === '/admin/case/background/create' || req.path === '/admin/case/background/edit' || req.path === '/admin/case/pubg/create' || req.path === '/admin/case/pubg/edit' || req.path === '/admin/dota2/updateImageShare' || req.path === '/admin/csgo/updateImageShare' || req.path === '/admin/pubg/create' || req.path === '/admin/pubg/edit' || req.path === '/admin/pubg/edit2' || req.path === '/admin/pubg/updateImageShare') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));// lusca registered AFTER cookieParser
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.url = req.originalUrl;
  res.locals.node_acl = node_acl;
  res.locals.baseURL = process.env.BASE_URL;
  res.locals.baseHOST = process.env.BASE_HOST;
  next();
});

//app.locals.kk = 'KKKKKKKKKKKKKKKKKKKKK';

/*****************************
* Require routes
******************************/
/*FRONTEND*/
var index = require('./routes/frontend/index');
var frontend_users = require('./routes/frontend/users');
var frontend_trade = require('./routes/frontend/trade');
var frontend_case = require('./routes/frontend/case');
var frontend_match = require('./routes/frontend/match');
var frontend_coupon = require('./routes/frontend/coupon');
var frontend_events = require('./routes/frontend/events');
var frontend_myplay = require('./routes/frontend/myplay');
var frontend_sysmessage = require('./routes/frontend/sysmessage')

/*BACKEND*/
var dashboard = require('./routes/backend/dashboard');
var backend_users = require('./routes/backend/users');
var backend_case = require('./routes/backend/case');
var backend_bot = require('./routes/backend/bot');
var backend_item = require('./routes/backend/item');
var backend_dota2 = require('./routes/backend/dota2');
var backend_csgo = require('./routes/backend/csgo');
var backend_pubg = require('./routes/backend/pubg');
var backend_inventory = require('./routes/backend/inventory');
var backend_logsys = require('./routes/backend/logsys');
var backend_deposit = require('./routes/backend/deposit');
var backend_withdraw = require('./routes/backend/withdraw');
var backend_depwith = require('./routes/backend/depwidhis');

var backend_setting = require('./routes/backend/setting');
var backend_history = require('./routes/backend/reserver');
var backend_analytics = require('./routes/backend/analytics');
var backend_coupon = require('./routes/backend/coupon');
var backend_permission = require('./routes/backend/permission');
/**/
var backend_hero = require('./routes/backend/hero');
var backend_slot = require('./routes/backend/slot');
var backend_quality = require('./routes/backend/quality');
var backend_rarity = require('./routes/backend/rarity');
var backend_slide = require('./routes/backend/slide');

var backend_tournament = require('./routes/backend/tournament');
var backend_match = require('./routes/backend/match');
var backend_team = require('./routes/backend/team');
var backend_events = require('./routes/backend/events');
var backend_trade = require('./routes/backend/trade');

/*****************************/

//app.use('/price', express.static('public'));

app.use(serveStatic('public/price'));

/************************
 * Primary app routes.
 ***********************/
app.get('/manifest.json', function(req, res) {
  res.sendFile(__dirname +'/manifest.json');
});

app.use('/', index);
app.use('/user', frontend_users);
app.use('/trade',frontend_trade);
app.use('/case',frontend_case);
app.use('/match',frontend_match);
app.use('/promo-code',frontend_coupon);
app.use('/event',frontend_events);
app.use('/history', frontend_myplay);
app.use('/sysmessage', frontend_sysmessage);

app.use('/admin', dashboard);
app.use('/admin/user', backend_users);
app.use('/admin/case', backend_case);
app.use('/admin/bot', backend_bot);
app.use('/admin/item', backend_item);
app.use('/admin/dota2', backend_dota2);
app.use('/admin/csgo', backend_csgo);
app.use('/admin/pubg', backend_pubg);
app.use('/admin/inventory', backend_inventory);
app.use('/admin/logsys', backend_logsys);
app.use('/admin/deposit', backend_deposit);
app.use('/admin/withdraw', backend_withdraw);
app.use('/admin/depwith',backend_depwith)
/**/
app.use('/admin/hero', backend_hero);
app.use('/admin/slot', backend_slot);
app.use('/admin/quality', backend_quality);
app.use('/admin/rarity', backend_rarity);

app.use('/admin/setting', backend_setting );
app.use('/admin/history', backend_history );
app.use('/admin/analytics', backend_analytics);
app.use('/admin/coupon', backend_coupon);
app.use('/admin/permission', backend_permission);
app.use('/admin/slider', backend_slide);

app.use('/admin/tournament', backend_tournament);
app.use('/admin/match', backend_match);
app.use('/admin/team', backend_team);
app.use('/admin/blog', backend_events);
app.use('/admin/trade', backend_trade);

/*****************************/
app.use(function (req, res, next) {
    //res.status(404).render("error/404.ejs")
    res.status(404).redirect('/');
})


// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
    app.use(errorHandler());
}


var port = app.get('port');
var server = ioServer(app, passport, sessionStore , cookieParser);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

 function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
  ? 'Pipe ' + port
  : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
    case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    process.exit(1);
    break;
    default:
    throw error;
  }
}
/**
 * Event listener for HTTP server "listening" event.
 */
 function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
  ? 'pipe ' + addr
  : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

/*
app.listen(app.get('port'), () => {
  console.log(app.get('port'));
});

*/
module.exports = app;