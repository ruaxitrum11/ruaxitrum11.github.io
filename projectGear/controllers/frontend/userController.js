/***********************
 * Module dependencies.
 **********************/
 const cluster = require('cluster');
 const request = require('request');
 const _ = require('lodash');
 const fs = require('fs');
 const download = require('download');
 const async = require('async');
 const passport = require('passport');
 const mongoose = require('mongoose');
 const multer = require("multer");
 const Entities = require('html-entities').XmlEntities;
 const entities = new Entities();

 const { check, validationResult } = require('express-validator/check');

// Models
const User = require('../../models/User');
// Method
/**
 * GET /
 * Home page.
 */

 exports.validatorCreateUser = [
 check('userName', 'Tài khoản phải có ít nhất 4 ký tự').isLength({ min: 4 }),
 check('email', 'Email không hợp lệ').isEmail(),
 check('password', 'Mật khẩu phải có ít nhất 4 ký tự').isLength({ min: 4 }),
 check('password_confirm', 'Mật khẩu không trùng khớp').custom((value, { req }) => value === req.body.password)
 ]

exports.create = async (req, res) => {
  if (req.body) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({status:false, errors : errors.array()});
    }

    try{
      const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
      });

      console.log(req.body.userName);
      console.log(req.body.email);

      let existingUser = await User.findOne({userName: req.body.userName});
      let existingEmail = await User.findOne({email: req.body.email});

      if (existingUser) {
        let errors = [{msg:"Tài khoản này đã được sử dụng"}]
        return res.send({status:false, errors : errors});
      }else if (existingEmail) {
        let errors = [{msg:"Email này đã được sử dụng"}]
        return res.send({status:false, errors : errors});
      }else {
        let saveUser = await user.save();
        if (saveUser) {
          return res.send({status:true});
        }else{
          let errors = [{msg:"Đăng kí thất bại. Vui lòng thử lại sau"}]
          return res.send({status:false, errors : errors});
        }
      }
    }catch(err){
      console.log("===============err=========================")
      console.log(err)
      console.log("===============err=========================")
    }
    console.log("Done")
  }
}




