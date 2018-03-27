var express = require('express');
var fs = require('fs');
var app = express();
 const path = require('path');
 const bodyParser = require('body-parser');


app.set('view engine','html');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*FRONTEND*/
var index = require('./routes/frontend/index');
var frontend_users = require('./routes/frontend/user');
// var frontend_trade = require('./routes/frontend/trade');
// var frontend_case = require('./routes/frontend/case');
// var frontend_match = require('./routes/frontend/match');
// var frontend_coupon = require('./routes/frontend/coupon');
// var frontend_events = require('./routes/frontend/events');
// var frontend_myplay = require('./routes/frontend/myplay');
// var frontend_sysmessage = require('./routes/frontend/sysmessage')

/*BACKEND*/
// var dashboard = require('./routes/backend/dashboard');
// var backend_users = require('./routes/backend/users');


app.use('/', index);
app.use('/user', frontend_users);


app.listen(5000);
console.log('listening port 5000');


module.exports = app;
