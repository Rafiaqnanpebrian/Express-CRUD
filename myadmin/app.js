var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require("serve-favicon");
var bodyparser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var customers = require('./routes/customers');
var expressValidator = require('express-validator');
var methodeOverride = require('method-override');

var connection = require('express-myconnection');
var mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var suppliers = require('./routes/suppliers');
var item = require('./routes/item');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(session({ secret: "secretpass123456" }));
app.use(flash());
app.use(expressValidator());
app.use(methodeOverride(function (req, res) {
  if (req.body && typeof req.body == 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  connection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'nodejs'
  }, 'pool')
)

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/customers', customers);
app.use('/suppliers', suppliers);
app.use('/item', item);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
