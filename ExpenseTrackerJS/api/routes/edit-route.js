'use strict';

const numeral = require('numeral');
const express = require('express');
const router = express.Router();
const error = require('./error-route');
const edit = require('../controllers/EditController');

router.use(function (req, res, next) {
  res.locals.authenticated = true;
  next();
});

router.all('*', function (req, res, next) {
  next();
});

router.post('/tally/:acctId', function (req, res, next) {
  edit.tallyAccount(req, res, numeral(req.params.acctId).value());
});

router.post('/add', function (req, res, next) {
  edit.addExpense(req, res);
});

router.post('/modify', function (req, res, next) {
  edit.modifyExpense(req, res);
});

router.post('/delete/:transId', function (req, res, next) {
  edit.deleteExpense(req, res, numeral(req.params.transId).value());
});

router.post('/swap/:cityId', function (req, res, next) {
  edit.swapExpenses(req, res, numeral(req.params.cityId).value());
});

router.post('/paybill', function (req, res, next) {
  edit.payBill(req, res);
});

router.use(error.inject404());

module.exports = router;
