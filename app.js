const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const { sequelize } = require('./models');

const app = express();

(async () => {
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log('Connection to databse established.');
  } catch (error) {
    console.error('Connection to database failed: ', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).render('page-not-found')
});

// error handler
app.use(function (err, req, res, next) {
  if (err.status === 404) {
    res.status(404).render('page-not-found', { err });
  } else {
    err.message = err.message || 'Something is wrong!'
    res.status(err.status || 500).render('error', { err });
  }
});

module.exports = app;
