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

let billsClosed = false;
const httpSuccess = 400;  // less than 400 are success codes.

const config = require('../config/config');
const routes = require('../config/route-config');
const mongo = require('../config/mongodb-config');
const billcloser = require('../services/BillCloserService');

const dbConnect = function () {
  mongo.connect(app.locals.log, function (db) {
    app.locals.db = db;
      // ensure it runs only one time.
    if(config.billcloser && !billsClosed) {
      billcloser.execute({db: app.locals.db, log: app.locals.log});
      billsClosed = true;
    }
  });
  // keep trying every x seconds.
  if(config.pulse.on) {
    setTimeout(dbConnect, config.pulse.interval);
  }
};

// store logger in app context for use from other components.
app.locals.log = require('../utils/logger');
dbConnect();

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

// list of middlewares in the order...
app.use(helmet());
app.use(compression());
app.use(morgan('dev', {
  skip: function (req, res) {
    return res.statusCode < httpSuccess;
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(favicon(path.join(__dirname, '../../public/images', 'favicon.ico')));

// inject application routes...
routes.route(app);

module.exports = app;
