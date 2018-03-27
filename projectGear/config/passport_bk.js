const passport = require('passport');
const request = require('request');
const OpenIDStrategy = require('passport-openid').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Steam API OpenID.
 */
passport.use(new OpenIDStrategy({
  apiKey: process.env.STEAM_KEY,
  providerURL: 'http://steamcommunity.com/openid',
  returnURL: 'http://localhost:3000/auth/steam/callback',
  realm: 'http://localhost:3000/',
  stateless: true,
  passReqToCallback: true
}, (req,identifier, done) => {
  const steamId = identifier.match(/\d+$/)[0];
  const profileURL = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_KEY}&steamids=${steamId}`;
  User.findOne({ steam: steamId }, (err, existingUser) => {
    if (err) { return done(err); }
    if (existingUser) return done(err, existingUser);
    if (!req.user) {
        return done(null, false, { message: 'Please login before.' });
    } else {
       request(profileURL, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const data = JSON.parse(body);
          const profile = data.response.players[0];
          User.findById(req.user.id, (err, user) => {
              if (err) { return next(err); }
              user.steam = steamId;
              user.profile.email = `${steamId}@steam.com`; // steam does not disclose emails, prevent duplicate keys
              user.tokens.push({ kind: 'steam', accessToken: steamId });
              user.profile.name = profile.personaname;
              user.profile.picture = profile.avatarmedium;
              user.save((err) => {
                done(err, user);
              });
          });  
        } else {
          done(error, null);
        }
      });
    }    
  });
}));

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found.` });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Invalid email or password.' });
    });
  });
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
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