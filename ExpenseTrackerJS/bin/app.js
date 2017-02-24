'use strict';

// builds path variable.
const path = require('path');
// serve favicon.
const favicon = require('serve-favicon');
// request content Parsers.
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// compresses the response..
const compression = require('compression');

// 'HTTP request' logging framework.
const morgan = require('morgan');
// blocking cross site attacks.
const helmet = require('helmet');

const express = require('express');
const app = express();

const httpSuccessCodes = 400;

// route config..
const routes = require('../api/config/route-config');

// store logger in app context for use from other components.
app.locals.log = require('../api/utils/logger');

// establish DB connection to MongoDB..
require('../api/config/mongodb-config').connect(app.locals.log, function cb(db) {
  app.locals.db = db;
});

app.set('views', path.join(__dirname, '../api', 'views'));
app.set('view engine', 'ejs');

// list of middlewares in the order...
app.use(helmet());
app.use(compression());
app.use(morgan('dev', {
  skip: function skip(req, res) {
    return res.statusCode < httpSuccessCodes;
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')));

// inject application routes...
routes.route(app);

module.exports = app;
