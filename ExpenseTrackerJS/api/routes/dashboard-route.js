'use strict';

const express = require('express');
const router = express.Router();
const error = require('./error-route');
const dashboard = require('../controllers/DashboardController');

router.use(function init(req, res, next) {
  res.locals.authenticated = true;
  next();
});

router.all('*', function all(req, res, next) {
  next();
});

router.get('/transaction/:transId', function getTransactionById(req, res, next) {
  dashboard.getTransactionById(req, res, req.params.transId);
});

router.get('/bills', function getBills(req, res, next) {
  dashboard.getBills(req, res);
});

router.get('/bill/:billId', function getBillById(req, res, next) {
  dashboard.getBillById(req, res), req.params.billId;
});

router.get('/account/:acctId', function getAccountById(req, res, next) {
  dashboard.getAccountById(req, res, req.params.acctId);
});

router.use(error.inject404());

module.exports = router;
