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
const userController = require('../../controllers/backend/userController');

// Route is : /admin/user/
router.get('/list', userController.list);
router.get('/listUser', userController.listUser);
router.post('/delete', userController.deleteUser);
router.get('/edit/:id', userController.getUserEdit);
router.post('/edit', userController.validatorUserEdit, userController.postUserEdit);
router.get('/add',userController.getUserAdd);
router.post('/addUser', userController.validatorUserAdd, userController.postUserAdd);

router.post('/uploadAvatar', userController.uploadAvatar);

module.exports = router;
