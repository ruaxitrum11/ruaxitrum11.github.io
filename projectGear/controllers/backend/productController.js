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
    }
});

let upload = multer({ 
	storage: storage,
	fileFilter: function (req, file, cb) {
		var ext = file.originalname.split('.')
		var arrImg = ['jpg', 'jepg', 'png'];

		if (ext && ext[1]) {
			if (!arrImg.indexOf(ext[ext.length -1])<0) {
				return cb(new Error('Vui lòng upload tệp hình ảnh!'));
			}
		}

		// if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
		// 	return cb(new Error('Vui lòng upload ảnh!'));
		// }
		cb(null, true);
	}
}).single('fileImage');

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

 	if(req.query.product_search_text && req.query.product_search_text !=""){
 		let regex = new RegExp(req.query.product_search_text.trim(), 'i')
 		query = {productName: {$regex : regex}}
 	} 

 	if (req.query.product_status && req.query.product_status !="") {
 		query['status'] = req.query.product_status;
 	}
 	if(req.query.product_brand && req.query.product_brand !=""){
 		query['brand'] = req.query.product_brand;
 	}
 	if(req.query.product_species && req.query.product_species !=""){
 		query['productSpecies'] = req.query.product_species;
 	} 

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
	// req.flash('success', { msg: ' successed.' });
	// req.flash('errors', { msg: 'Error uploading file.' });
	res.render('backend/product/add');
}





exports.postProductAdd = async (req,res) => {
	upload (req,res,async function(err) {
		if(err) {
			console.log(err);
			return res.send({status:false, err : err});
		}
		console.log(req.file)

		try{
			if (req.body) {
				console.log(req.body)
				if (req.body.productName == "") {
					let errors = [{msg:"Tên sản phẩm không được để trống"}]
					return res.send({status:false, errors : errors});
				} else if (req.body.price == "" ) {
					let errors = [{msg:"Giá sản phẩm không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.quantity == ""  ) {
					let errors = [{msg:"Số lượng sản phẩm không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (!req.file) {
					let errors = [{msg:"Vui lòng tải ảnh sản phẩm"}]
					return res.send({status:false, errors : errors});
				}else{
					let existingProduct = await Product.findOne({ productName : req.body.productName});

					if (existingProduct && existingProduct != "") {
						let errors = [{msg:"Tên sản phẩm đã tồn tại"}]
						return res.send({status:false, errors : errors});
					}

					const product = new Product({
						productName : req.body.productName,
						productSpecies : req.body.productSpecies,
						color : req.body.color,
						price : req.body.price,
						quantity : req.body.quantity ,
						brand : req.body.brand ,
						description : req.body.description
					});

					if (req.file) {
						product.productThumb = req.file.filename;
					}

					let saveProduct = await product.save();
					if (!saveProduct) {
						let errors = [{msg:"Thêm sản phẩm thất bại"}]
						return res.send({status:false, errors : errors});
					}
					return res.send({status:true});

				}
			}
		}

		catch(errors){
			console.log(errors);
			return res.send({status:false, errors : errors});
		}

	})
}


exports.getProductEdit = async (req,res) =>{
	if (req.params && req.params.id) {
		try{
			let product = await Product.find({_id : req.params.id});
			res.render('backend/product/edit',{product:product[0],moment:moment})
		}catch(err){
		}
	}
}


exports.postProductEdit = async (req,res) => {
	upload (req,res,async function(err) {
		if(err) {
			console.log(err);
			return res.send({status:false, err : err});
		}

		try{
			if (req.body) {
				console.log(req.body)
				if (req.body.productName == "") {
					let errors = [{msg:"Tên sản phẩm không được để trống"}]
					return res.send({status:false, errors : errors});
				} else if (req.body.price == "" ) {
					let errors = [{msg:"Giá sản phẩm không được để trống"}]
					return res.send({status:false, errors : errors});
				}else if (req.body.quantity == ""  ) {
					let errors = [{msg:"Số lượng sản phẩm không được để trống"}]
					return res.send({status:false, errors : errors});
				}else{
					let existingProduct = await Product.findOne({_id : {$ne: req.body.id}, productName: req.body.productName});

					if (existingProduct && existingProduct != "") {
						let errors = [{msg:"Tên sản phẩm đã tồn tại"}]
						return res.send({status:false, errors : errors});
					}
					

					const productDataUpdate = {
						productName : req.body.productName,
						productSpecies : req.body.productSpecies,
						color : req.body.color,
						price : req.body.price,
						quantity : req.body.quantity ,
						brand : req.body.brand ,
						description : req.body.description
					};

					if (req.file) {
						productDataUpdate.productThumb = req.file.filename;
					}

					// console.log(productDataUpdate)

					let updateProduct = await Product.update({ _id: req.body.id}, { $set: productDataUpdate});

					if (updateProduct) {
						return res.send({status:true});
					}
				}
			}
		}

		catch(errors){
			console.log(errors);
			return res.send({status:false, errors : errors});
		}

	})
}



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