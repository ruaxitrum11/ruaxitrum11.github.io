var express = require('express');
var router = express.Router();
const passport = require('passport');
var path = require('path');
// console.log ("------------------------");
// console.log(__dirname );
// console.log ("------------------------");
// var dir = path.join(__dirname, '..', 'config');
// const passportConfig = require('../../config/passport');
const adminController = require('../../controllers/backend/adminController');

router.get('/', adminController.admin);

module.exports = router;
