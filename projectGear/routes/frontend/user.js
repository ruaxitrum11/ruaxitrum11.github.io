var express = require('express');
var router = express.Router();
const passportConfig = require('../../config/passport');
const passport = require('passport');
var path = require('path');
const mongoose = require('mongoose');
// console.log ("------------------------");
// console.log(__dirname );
// console.log ("------------------------");
// var dir = path.join(__dirname, '..', 'config');
// const passportConfig = require('../../config/passport');
const userController = require('../../controllers/frontend/userController');

// Route is : /user/
router.post('/create', userController.validatorCreateUser, userController.create);

module.exports = router;
