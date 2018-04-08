const cluster = require('cluster');
const request = require('request');
const _ = require('lodash');
const fs = require('fs');
const download = require('download');
const async = require('async');
const bcrypt = require('bcrypt-nodejs');
const multer = require('multer');
const path = require('path');
const moment = require('moment');



const { check, validationResult } = require('express-validator/check');

//Setup multer upload
let storage = multer.diskStorage({
    // Configuring multer to upload folder
    destination: function(req, file, cb) {
    	cb(null, './public/upload/thumbProduct')
    },
    // Rename file to save in the database.
    filename: function(req, file, cb) {
    	var ext = file.originalname.split('.')
    	cb(null, ext[0]+ '_' + Date.now() + '.' + ext[ext.length - 1]);
    	console.log(ext);
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
	},
}).single('thumb');

 // Models
 const Product = require('../../models/Product');


// Method
/**
 * GET /
 * Admin/product/list.
 */

 exports.list = (req, res) => {
 	return res.render('backend/product/list');
 }

 exports.listProduct = async (req,res) =>{
 	let page = 1;
 	let limit = 20;
 	let totalPage = 1;
 	let query = {};
 	if (req.query.page) {
 		page = parseInt(req.query.page);
 	}

 	// if(req.query.user_search_text && req.query.user_search_text !=""){
 	// 	let regex = new RegExp(req.query.user_search_text.trim(), 'i')
 	// 	query = {$or : [{email: {$regex : regex}},{userName: {$regex : regex}}]}
 	// } 

 	// if (req.query.user_status && req.query.user_status !="") {
 	// 	query['status'] = req.query.user_status;
 	// }
 	// if(req.query.user_level && req.query.user_level !=""){
 	// 	query['level'] = req.query.user_level;
 	// }
 	// if(req.query.user_role && req.query.user_role !=""){
 	// 	query['role'] = req.query.user_role;
 	// } 

 	let skip = (page - 1)*limit;

 	try{
 		let [count, data] = await Promise.all([
 			Product.count(query),
 			Product.find(query).sort({createdAt : -1}).skip(skip).limit(limit)
 			])

 		let listProduct = [];

 		if (count && count >0) {
 			totalPage = Math.ceil(count/limit);
 		}

 		if (data && data.length) {
 			listProduct = data;
 		}

 		res.send({status: true, page : page, totalPage : totalPage, listProduct : listProduct});



 	}catch(err){
 		res.send({status:false})
    // console.log("===============err=========================")
    console.log(err)
    // console.log("===============err=========================")
}
}

exports.getProductAdd = async (req,res) =>{
	res.render('backend/product/add');
}

exports.validatorProductAdd = [
check('productName', 'Tên sản phẩm không được để trống').isLength({ min: 1 }),
check('price', 'Giá tiền sản phẩm không được để trống').isLength({ min: 1 }),
check('quantity', 'Số lượng sản phẩm không được để trống').isLength({ min: 1 }),

]

exports.postProductAdd = async (req,res) => {


	if (req.body) {

		console.log(req.body);

		console.log(req.file);

		const errors = validationResult(req);


		if (!errors.isEmpty()) {
			return res.send({status:false, errors : errors.array()});
		}

		try{

			const product = new Product({
				productName : req.body.productName,
				productSpecies : req.body.productSpecies,
				// thumb : req.body.thumb,
				color : req.body.color,
				price : req.body.price,
				quantity : req.body.quantity ,
				brand : req.body.brand ,
				description : req.body.description

			});
			console.log(product)

			let existingProduct = await Product.findOne({ productName : req.body.productName});
			if (existingProduct) {
				let errors = [{msg:"Sản phẩm này đã tồn tại"}];
				return res.send({status:false, errors : errors});
			}else{
				let saveProduct = await product.save();
				if (saveProduct) {
					return res.send({status:true});
				}
			}
		}catch(errors){
			console.log(errors);
			res.send({status:false, errors : errors});
		}
		console.log("Done")
	}
}

// exports.postProductAdd = (req,res) =>{
// 	// console.log(req)
// 	upload(req,res,function(err) {
// 		// console.log(req)
// 		if(err) {
// 			console.log('aaaaaaaaaaaaaaaaaaaaaaaa')
// 			console.log(err);
// 			return res.send({status:false, msg:'Chỉ cho phép tải ảnh lên !'});
// 		}
// 		console.log("upload done")
// 		if (req.file) {
// 			Product.update( {productThumb: req.file.filename}, (err,results)=>{
// 				if(err){
// 					return res.send({status:false, msg:'Tải ảnh thất bại'});
// 				}
// 				return res.send({status:true, msg:'Tải ảnh thành công !'});
// 			})
// 		}else{
// 			return res.send({status:false, msg:'Không tìm thấy ảnh !'});
// 		}

// 	})
// }



exports.deleteProduct = async (req,res) =>{
	if (req.body.id) {
		try{
			let deleteProduct = await Product.remove({_id : req.body.id});
			if (deleteProduct.result) {
				res.send({status:true});
			}else{
				res.send({status:false});
			}
		}catch(err){
			res.send({status:false})
		}
	}
}

