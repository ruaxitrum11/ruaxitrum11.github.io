const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const mconnect = require('../config/connDB');
const productSchema = new mongoose.Schema({
  productName : String ,
  thumb : String ,
  color : {type : Number , default : 1} , //1 : Màu số 1 , //2 : màu số 2 , .... /n : màu số n
  price : Number,
  quantity: Number,
  description : String,
  brand : {type: Number, default: 1}, // 1 : Steelseries, 2 : Razer , 3: Ozone , 4: MSI


}, { timestamps: true });

const Product = mconnect.model('Product', productSchema);

module.exports = Product;