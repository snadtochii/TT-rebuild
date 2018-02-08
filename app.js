'use strict'
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet')
const mongoose = require('mongoose');

const config = require('./configs/config');

const users = require('./users/user.routes');
const cases = require('./cases/case.routes');

mongoose.connect(config.MONGO_URI, { useMongoClient: true });
let db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to DB');
});

db.on('error', (err) => {
  console.log(err);
});

mongoose.Promise = global.Promise;
const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(config.API_URL + '/users', users);
app.use(config.API_URL + '/cases', cases);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err.status);
  res.json({err: err.message});
});

module.exports = app;
