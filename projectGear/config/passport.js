const passport = require('passport');
const request = require('request');
const OpenIDStrategy = require('passport-openid').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const Setting = require('../models/Setting');
const Loginhis = require('../models/Loginhis');
const InventoryDota2 = require('../models/InventoryDota2');
const InventoryCSGO = require('../models/InventoryCSGO');
const InventoryPUBG = require('../models/InventoryPUBG');
const ip = require('ip');
const geoip = require('geoip-lite');
const async = require('async');


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

function getLevel(steamId) {
   return new Promise((resolve, reject) => { //
      const levelURL = `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${process.env.STEAM_KEY}&steamid=${steamId}`;
      request(levelURL, function(err,response ,body){
          const  statusCode = exports.getStatusCode(response);
          if (err || statusCode !== 200 ) {
            const errorMsg = (err && err.message) || "HTTP error "+ statusCode;
            return reject(errorMsg,statusCode,body);
          }
          resolve(body);
      });
    }
  );
}

exports.getStatusCode = (response) => {
  return (response && response.statusCode) || "(unknown)";
};

/**
 * Steam API OpenID. (V1)
 */
passport.use(new OpenIDStrategy({
  apiKey: process.env.STEAM_KEY,
  providerURL: 'http://steamcommunity.com/openid',
  returnURL: process.env.BASE_URL+'/auth/steam/callback',
  realm: process.env.BASE_URL,
  stateless: true,
  passReqToCallback: true
}, (req,identifier, done) => {
  const steamId = identifier.match(/\d+$/)[0];
  const profileURL = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_KEY}&steamids=${steamId}`;
  User.findOne({ steamID: steamId }, (err, existingUser) => {
    if (err) { console.log('=======================1111111111111'); return done(err); }
    if (existingUser) {
      if(existingUser.status == 0){
        return done(null, false, { msg: `Account ${existingUser.email} has been banned !` });
      }else if(existingUser.status == 2 && existingUser.emailVerifyCodeCount <= 2){
        return done(null, false, {status: false, msg: `Account ${existingUser.email} is not verify email. Please verify email at <a href="/login/verify/code">here</a>` });
      }else if(existingUser.status == 2 && existingUser.emailVerifyCodeCount > 2){
        return done(null, false, {status: false, msg: `Account ${existingUser.email} re-send verify code more than 3 times. Please contact with our supporter.` });
      }else{
        console.log('=======================22222222222222');
        return done(err, existingUser);
      }
    };
    if (!req.user) {
      getLevel(steamId).then((level) => {
        request(profileURL, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            const profile = data.response.players[0];
            let userName = profile.personaname.replace(/[<>]/g, '');
            let newUser = new User({
              email: '',
              userName: userName,
              steamID: steamId,
              avatar: profile.avatarmedium,
              permission: 0,
              user_ver: 2,
              profile: {
                email: `${steamId}@steam.com`, // steam does not disclose emails, prevent duplicate keys,
                name: userName,
                picture: profile.avatarmedium,
                level: JSON.parse(level).response.player_level,
              }
            })

            newUser.tokens.push({ kind: 'steam', accessToken: steamId });

            newUser.save((err, user) => {
              if (err) {
                return done(err, null);
              } else {
                return done(null, user);
              }         
            });
            
          } else {
            return done(error, null);
          }
        });
      }).catch((err, statusCode, body) => {
          console.log ("---------ERR---------------");
          console.log(err);
          console.log ("---------ERR---------------");
      });       
    } else {
       getLevel(steamId).then((level)=>{
         console.log(JSON.parse(level).response.player_level);
         request(profileURL, (error, response, body) => {
            if (!error && response.statusCode === 200) {
              const data = JSON.parse(body);
              const profile = data.response.players[0];
              let userName = profile.personaname.replace(/[<>]/g, '');
              User.findById(req.user.id, (err, user) => {
                  if (err) { console.log('=======================44444444444444444'); return next(err); }
                  user.steamID = steamId;
                  user.profile.email = `${steamId}@steam.com`; // steam does not disclose emails, prevent duplicate keys
                  user.tokens.push({ kind: 'steam', accessToken: steamId });
                  user.userName = userName;
                  user.avatar = profile.avatarmedium;
                  user.profile.name = userName;
                  user.profile.picture = profile.avatarmedium;
                  user.profile.level = JSON.parse(level).response.player_level;
                  user.save((err) => {
                    done(err, user);
                    console.log('=======================5555555555555555555');
                  });
              });
            } else {
              done(error, null);
              console.log('=======================66666666666666');
            }
        });
      }).catch((msg, statusCode, body) => {
          console.log ("------------------------");
          console.log(msg);
          console.log ("------------------------");
          console.log('=======================7777777777777777777');
      });
      
    }
  });
}));

/**
 * Steam API OpenID. (V2)
 */
/*passport.use(new OpenIDStrategy({
  apiKey: process.env.STEAM_KEY,
  providerURL: 'http://steamcommunity.com/openid',
  returnURL: process.env.BASE_URL+'/auth/steam/callback',
  realm: process.env.BASE_URL,
  stateless: true,
  passReqToCallback: true
}, (req,identifier, done) => {
  req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
  const steamId = identifier.match(/\d+$/)[0];
  const profileURL = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_KEY}&steamids=${steamId}`; 
  if(req.user){
    return done(null, req.user);
  }else{
    User.findOne({ steamID: steamId }, (err, existingUser) => {
      if (err) {  return done(err, null); }
      if (existingUser) {
        if(existingUser.status == 0){
          return done(null, false, { msg: `Account ${existingUser.email} has been banned!`});
        }else{
          return done(null, existingUser);
        }
      }else{
        getLevel(steamId).then((level)=>{
          request(profileURL, (error, response, body) => {
            if (!error && response.statusCode === 200) {
              const data = JSON.parse(body);
              const profile = data.response.players[0];
              let userName = profile.personaname.replace(/[<>]/g, '');
              let newUser = new User({
                email: `${steamId}@steam.com`,
                userName: userName,
                steamID: steamId,
                avatar: '/avatar/no_avatar.png',
                permission: 0,
                user_ver: 2,
                profile: {
                  email: `${steamId}@steam.com`, // steam does not disclose emails, prevent duplicate keys,
                  name: userName,
                  picture: profile.avatarmedium,
                  level: JSON.parse(level).response.player_level,
                }
              })

              newUser.tokens.push({ kind: 'steam', accessToken: steamId });

              newUser.save((err, user) => {
                if (err) {
                  return done(err, null);
                } else {
                  return done(null, user);
                }         
              });
              
            } else {
              return done(error, null);
            }
          });
        }).catch((err, statusCode, body) => {
            console.log ("---------ERR---------------");
            console.log(err);
            console.log ("---------ERR---------------");
        });
      }
    });
  }
  
  
}));*/

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  var criteria = {$or: [{email: email.toLowerCase()}, {userName: email}, {steamID: email}]};
  User.findOne(criteria, (err, user) => {
    if (err) { 
      console.log('------------- LOGIN ERROR -------------- ');
      console.log(err);
      console.log('------------- LOGIN ERROR -------------- ');

      // return done(err);
      return done(null, false, {status: false, msg: `Account ${email} not found!` });
     }
    if (!user) {
      return done(null, false, {status: false, msg: `Account ${email} not found!` });
    }else{
      if(user.status == 0){
        return done(null, false, {status: false, msg: `Account ${email} has been banned!` });
      }else if(user.status == 2 && user.emailVerifyCodeCount <= 2){
        return done(null, false, {status: false, msg: `Account ${email} email has not been verified. Please verify email <a href="/login/verify/code">here</a>` });
      }else if(user.status == 2 && user.emailVerifyCodeCount > 2){
        return done(null, false, {status: false, msg: `Account ${email} re-send verify code more than 3 times. Please contact with our supporter!` });
      }else{
        user.comparePassword(password, (err, isMatch) => {
          if (err) { 
            console.log('------------- LOGIN err 22222222222 -------------- ');
            console.log(err);
            console.log('------------- LOGIN err 22222222222 -------------- ');
            // return done(err); 
            return done(null, false, {status: false, msg: `Account ${email} not found!` });
          }
          if (isMatch) { 
            return done(null, user);
          }
           return done(null, false, {status: false, msg: 'Invalid account or password.' });
        });
      }
    }

  });
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if(req.user.status != 0){
      return next();
    }else{ // user is blocked
      return res.render('error/404');
    }
  }
  res.redirect('/login');
  // res.redirect('/auth/openid');
};


exports.isAuthAdmin = (req, res, next) => {
   if (req.isAuthenticated()) {
      if (req.user.permission) {
        if(req.user.status != 0){
          // console.log('============== WELCOME ADMINISTRATOR ===============')
          return next();
        }else{ // user is blocked
          return res.render('error/404');
        }
      }
   }
  //  res.redirect('/login');
   res.redirect('/');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};

/**
* Trade Link setting middleware.
*/
exports.isTradeLink = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.tradeLink) {
         return next();
      }
   }
   res.redirect('/user/tradeLink');
}


exports.refActive = (req, res, next) => {
  // console.log('=======================REF ACTIVE = CREATE INVENTORY (IF NOT HAVE)');  
  // when new member login with STEAM, Check and create inventory (dota2 && csgo && PUBG)  
  async.parallel([
    function(callback) {
        InventoryDota2
          .findOne({steamID: req.user.steamID})
          .select({steamID: 1, userName: 1, _id: 0})
          .lean()
          .exec(function(err, invent){
          if(err){
            return callback(err, null);
          }
          if (invent) {
             return callback(null, true);
          }
          let createInventory = new InventoryDota2({
            steamID: req.user.steamID,
            userName: req.user.userName,
            items: []
          });
          createInventory.save((err) => {
            if(err){
               return callback(err, null);
            }
            return callback(null, true);

          });
  
      });
    },
    function(callback) {
        InventoryCSGO
          .findOne({steamID: req.user.steamID})
          .select({steamID: 1, userName: 1, _id: 0})
          .lean()
          .exec(function(err, invent){
          if(err){
            return callback(err, null);
          }
          
          if (invent) {
             return callback(null, true);
          }
          let createInventory = new InventoryCSGO({
            steamID: req.user.steamID,
            userName: req.user.userName,
            items: []
          });
          createInventory.save((err) => {
            if(err){
               return callback(err, null);
            }
            return callback(null, true);
          });
  
        });
    },
    function(callback) {
        InventoryPUBG
          .findOne({steamID: req.user.steamID})
          .select({steamID: 1, userName: 1, _id: 0})
          .lean()
          .exec(function(err, invent){
          if(err){
            return callback(err, null);
          }

          if (invent) {
             return callback(null, true);
          }
          
          let createInventory = new InventoryPUBG({
            steamID: req.user.steamID,
            userName: req.user.userName,
            items: []
          });
          createInventory.save((err) => {
            if(err){
               return callback(err, null);
            }
            return callback(null, true);
          });
          
            
        });
    }],
    function(err, results) {
        if (err) { req.logout(); return }
        res.redirect(req.session.returnTo || '/');
    });
};
/**
* get ip & address middleware.
*/
exports.loginHis = (req, res, next) =>{
    if (req.isAuthenticated()) {
         var ipAddress = getClientIp(req);
         var geoObj = {};
         var geoLocation = geoip.lookup(ipAddress);
         //var geoLocation = geoip.lookup('27.72.59.52');

        if (geoLocation && geoLocation.hasOwnProperty('country')) {
            geoObj.steamID = req.user.steamID;
            geoObj.steamName = req.user.profile.name;
            geoObj.range = geoLocation.range;
            geoObj.country =  geoLocation.country;
            geoObj.region =  geoLocation.region;
            geoObj.city =  geoLocation.city;
            geoObj.ll = geoLocation.ll;
            geoObj.metro =  geoLocation.metro;
            geoObj.zip = geoLocation.zip;
            Loginhis.create(geoObj,function (err, geo) {
                if (err) {
                   console.log ("--------ERR INSERT LOGINHIS----------------");
                   console.log(err);
                   console.log ("--------ERR INSERT LOGINHIS----------------");
                }
            });
        }

        return next();
   }
}


var getClientIp = function(req) {
  //var ipAddress =  req.ip || req.connection.remoteAddress;
  var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (!ipAddress) {
      return '';
    }
  // convert from "::ffff:192.0.0.1"  to "192.0.0.1"
    if (ipAddress.substr(0, 7) == "::ffff:") {
      ipAddress = ipAddress.substr(7)
    }
  return ipAddress;
};

/**
* Update team win middleware.
*/
exports.updateTeamWinMiddleware = (req, res, next) => {

  Setting.find({$or: [{key: '_maintain_'},{key: '_fb_feature_image_'},{key: '_updated_team_win_'},{key: '_referral_link_'}]}, function(err, setting){
    res.app.locals.imageFace = 'dota2bestyolo_share.jpg';
    var imageFace = setting.find(function(elem){
      if (elem.key == '_fb_feature_image_') {
         res.app.locals.imageFace = elem.value;
      }
    });
    
    var refBonus = setting.find(function(elem){
      if (elem.key == '_referral_link_') {
        res.app.locals.refBonus = elem.obj_value;
      }
    });

    var maintain = setting.find(function(elem){
      if(elem.key == '_maintain_' && elem.val_boolean){
        return true;
      }else{
        return false;
      }
    });
    var paying = setting.find(function(elem){
      if(elem.key == '_updated_team_win_' && elem.val_boolean){
        return true;
      }else{
        return false;
      }
    });
    
    if(maintain){
      res.redirect('/maintenance');
    }else{
      if(paying){
        if(req.xhr){
          return res.send({msg: 'Time for paying!'});
        }else{
          res.redirect('/paying');
        }
      }else{
        return next();
      }
    }
    // if(setting && setting.val_boolean){
    //   //return res.render('frontend/update_team_win');
    //   res.redirect('/paying');
    // }else{
    //   return next();
    // }
  })
}

/**
* Update pulling status middleware.
*/
exports.pulling = (req, res, next) => {
  Setting.findOne({key: '_pull_reserve_'}, function(err, setting){
   /* console.log('================== MIDDLEWARE == PULLING ==');
    console.log(setting);*/
    
    if(setting && setting.val_boolean){
      return res.send({status: false, msg: 'Someone is pulling. Please wait and try again later!'});
    }else{
      return next();
    }
  })
}
