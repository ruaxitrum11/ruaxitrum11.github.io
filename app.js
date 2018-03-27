var express = require('express');
var fs = require('fs');
var app = express();
var mysql = require('mysql');


app.set('view engine','html');
app.use(express.static(__dirname + '/views'));


// var testjson = '{"name": "Hieu", "age": "24"}';
// var	obj = JSON.parse(testjson);
// console.log(obj.name);


app.get('/index', function(req, res) {
	res.sendFile('/views/index.html',{root: __dirname });
});

app.get('/testJson',function(reqd,res){
	var testjson = '{"name": "Hieu", "age": "24"}';
	testobj = JSON.parse(testjson);
	// console.log(obj.name);
	res.send(testjson);
});

//conect my sql
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database : "gearshop"
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

app.listen(5000);
console.log('listening port 5000');
