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

  return res.render('frontend/index');
}
