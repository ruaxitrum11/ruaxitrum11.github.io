/***********************
 * Module dependencies.
 **********************/
 const cluster = require('cluster');
 const request = require('request');
 const _ = require('lodash');
 const fs = require('fs');
 const download = require('download');
 const async = require('async');

// Models
const User = require('../../models/User');
// Method
/**
 * GET /
 * Home page.
 */
 exports.index = (req, res) => {
  // const user = new User({
  //   userName: "huyhung",
  //   password: "huyhung",
  //   avatar: 'no_avatar.png'
  // });

  // user.save((err) => {
  //   if (err) { return next(err) 
  //     console.log(err)
  //   }
  //     console.log("Done")
  // });

  // console.log("ahihi")
  return res.render('frontend/index');
}
