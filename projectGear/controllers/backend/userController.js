/***********************
 * Module dependencies.
 **********************/
/***********************
 * Module dependencies.
 **********************/
 const cluster = require('cluster');
 const request = require('request');
 const _ = require('lodash');
 const fs = require('fs');
 const download = require('download');
 const async = require('async');
 const bcrypt = require('bcrypt-nodejs');
 const multer = require("multer");
 const path = require('path');
 const moment = require('moment');


 const { check, validationResult } = require('express-validator/check');


 //Setup multer upload
 let storage = multer.diskStorage({
    // Configuring multer to upload folder
    destination: function(req, file, cb) {
      cb(null, './public/upload/avatar')
    },
    // Rename file to save in the database.
    filename: function(req, file, cb) {
      var ext = file.originalname.split('.')
      cb(null, ext[0]+ '_' + Date.now() + '.' + ext[ext.length - 1]);
    }
  });

 let upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Chỉ cho phép tải ảnh lên'))
    }

    callback(null, true)
  }
}).single('file');

 function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

// Models
const User = require('../../models/User');
// Method
/**
 * GET /
 * Admin/user/list.
 */
 exports.list = (req, res) => {
  return res.render('backend/user/list');
}

exports.listUser = async (req,res) =>{
  let page = 1;
  let limit = 20;
  let totalPage = 1;
  let query = {};
  if (req.query.page) {
    page = parseInt(req.query.page);
  }

  if(req.query.user_search_text && req.query.user_search_text !=""){
    let regex = new RegExp(req.query.user_search_text.trim(), 'i')
    query = {$or : [{email: {$regex : regex}},{userName: {$regex : regex}}]}
  } 

  if (req.query.user_status && req.query.user_status !="") {
    query['status'] = req.query.user_status;
  }
  if(req.query.user_level && req.query.user_level !=""){
    query['level'] = req.query.user_level;
  }
  if(req.query.user_role && req.query.user_role !=""){
    query['role'] = req.query.user_role;
  } 

  let skip = (page - 1)*limit;

  try{
    let [count, data] = await Promise.all([
      User.count(query),
      User.find(query).sort({createdAt : -1}).skip(skip).limit(limit)
      ])

    let listUser = [];

    if (count && count >0) {
      totalPage = Math.ceil(count/limit);
    }

    if (data && data.length) {
      listUser = data;
    }

    res.send({status: true, page : page, totalPage : totalPage, listUser : listUser , moment:moment});

  }catch(err){
    res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
  }
}

exports.deleteUser = async (req,res) =>{
  if (req.body.id) {
    try{
      let deleteUser = await User.remove({_id : req.body.id})
      if (deleteUser.result) {
        res.send({status:true})
      }else{
        res.send({status:false})
      }
    }catch(err){
      res.send({status:false})
    }
  }
}

exports.getUserEdit = async (req,res) =>{
  if (req.params && req.params.id) {
    try{
      let user = await User.find({_id : req.params.id});
      res.render('backend/user/edit', {user:user[0],moment:moment})
    }catch(err){
    }
  }
}

exports.getUserAdd = async (req,res) =>{
  res.render('backend/user/add');
}


// Method
/**
 * POST /
 * Admin/user/list.
 */
 exports.validatorUserEdit = [
 check('new_email', 'Email không hợp lệ').isEmail(),
 ]

 exports.postUserEdit = async (req,res) =>{
  if (req.body) {

    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({status:false, errors : errors.array()});
    }


    try{
      // console.log(req.body)
      let existingEmail = await User.findOne({_id : {$ne: req.body.id}, email: req.body.new_email});
      if (existingEmail) {   
        res.send({status:false, errors : 'Email đã tồn tại'});
      } 



      let dataUpdate = {
        email : req.body.new_email,
        userName : req.body.new_userName,
        password : req.body.new_password,
        nameUser : req.body.new_nameUser,
        phoneNumber : req.body.new_phoneNumber,
        address : req.body.new_address,
        birthDay : req.body.new_birthDay,
        gender : req.body.new_gender,
        status : req.body.new_status,
        level : req.body.new_level,
        role : req.body.new_role
      }

      console.log(req.body.new_birthDay);

      let updateUser = await User.update({ _id: req.body.id}, { $set: dataUpdate});



      if (updateUser) {
       res.send({status:true});
     }

   }
   catch(err){
    console.log(err)
    res.send({status:false, errors : errors});
  }
}
}

exports.validatorUserAdd = [
check('userName', 'Tài khoản phải có ít nhất 4 ký tự').isLength({ min: 4 }),
check('email', 'Email không hợp lệ').isEmail(),
check('password', 'Mật khẩu phải có ít nhất 4 ký tự').isLength({ min: 4 }),
check('password_confirm', 'Mật khẩu không trùng khớp').custom((value, { req }) => value === req.body.password)
]

exports.postUserAdd = async (req,res) =>{
 if (req.body) {

  console.log(req.body);

  const errors = validationResult(req);


  if (!errors.isEmpty()) {
    return res.send({status:false, errors : errors.array()});
  }

  console.log(errors.array())

  try{
    const user = new User({
      userName: req.body.userName,
      password: req.body.password,
      email : req.body.email,
      nameUser : req.body.nameUser,
      phoneNumber : req.body.phoneNumber,
      address : req.body.address,
      birthDay : req.body.birthDay,
      gender : req.body.gender,
      status : req.body.status,
      level : req.body.level,
      role : req.body.role

    }); 


    let existingUser = await User.findOne({ userName: req.body.userName});
    let existingEmail = await User.findOne({ email: req.body.email});

    // console.log(existingUser);
    // console.log(existingEmail);


    if (existingUser) {
      let errors = [{msg:"Tài khoản này đã được sử dụng"}]
      return res.send({status:false, errors : errors});
    }else if (existingEmail) {
      let errors = [{msg:"Email này đã được sử dụng"}]
      return res.send({status:false, errors : errors});
    }else{
      let saveUser = await user.save();
      if (saveUser) {
        return res.send({status:true});
      }
    }
  }catch(errors){
    res.send({status:false, errors : errors});
    console.log(errors);
  }
  console.log("Done")
}
}

exports.uploadAvatar = (req,res) =>{
  // console.log(req)
  upload(req,res,function(err) {
    // console.log(req)
    if(err) {
      console.log(err);
      return res.send({status:false, msg:'Chỉ cho phép tải ảnh lên !'});
    }
    // console.log("upload done")

    if(req.body.id && req.body.id != ''){
      if (req.file) {
        User.update({_id : req.body.id}, {avatar: req.file.filename}, (err,results)=>{
          if(err){
            return res.send({status:false, msg:'Tải ảnh thất bại'});
          }
          return res.send({status:true, msg:'Tải ảnh thành công !'});
        })
      }else{
        return res.send({status:false, msg:'Không tìm thấy ảnh !'});
      }
    }else{
      return res.send({status:false, msg:'Không tìm thấy ảnh !'});
    }
  })
}
