const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
const productSchema = new mongoose.Schema({
	productName : String ,
	productThumb : String ,
  	color : {type : Number , default : 1} , //1 : Màu số 1 , 2 : màu số 2 , .... n : màu số n
  	price : Number,
  	quantity: Number,
  	description : String,
  	brand : Number, // 1 : Steelseries, 2 : Razer , 3: Ozone , 4: MSI
  	productSpecies : Number, //1 : Tai nghe , 2 : Bàn phím , 3 : Chuột , 4 : Laptop , //5 : Phụ kiện khác
  	status : {type : Number , default : 1} , //1 : còn hàng , 0: hết hàng  

  }, { timestamps: true });

const Product = mconnect.model('Product', productSchema);

module.exports = Product;