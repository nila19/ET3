'use strict';

const express = require('express');
const router = express.Router();
const error = require('./error-route');
const summary = require('../controllers/SummaryController');

router.use(function init(req, res, next) {
  res.locals.authenticated = true;
  next();
});

router.all('*', function all(req, res, next) {
  next();
});

router.get('/go', function doSummary(req, res, next) {
  summary.doSummary(req, res);
});

router.get('/chart', function doChart(req, res, next) {
  summary.doChart(req, res);
});

router.use(error.inject404());

module.exports = router;
