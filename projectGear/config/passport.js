const passport = require('passport');
const request = require('request');
const OpenIDStrategy = require('passport-openid').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).
  lean().
  exec((err, user) => {
    done(err, user);
  })
});

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
