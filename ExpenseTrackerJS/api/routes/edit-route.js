'use strict';

const express = require('express');
const router = express.Router();
const error = require('./error-route');
const tally = require('../controllers/TallyController');
const edit = require('../controllers/EditController');

router.use(function (req, res, next) {
  res.locals.authenticated = true;
  next();
});

router.all('*', function (req, res, next) {
  next();
});

// TODO Remove city from this.
router.post('/tally/:cityId/:acctId', function (req, res, next) {
  tally.tallyAccount(req, res, req.params.acctId);
});

router.post('/add', function (req, res, next) {
  edit.addExpense(req, res);
});

router.post('/modify', function (req, res, next) {
  edit.modifyExpense(req, res);
});

router.post('/delete/:cityId/:transId', function (req, res, next) {
  edit.deleteExpense(req, res, req.params.transId);
});

router.post('/swap/:cityId', function (req, res, next) {
  edit.swapExpenses(req, res, req.params.cityId);
});

router.post('/paybill', function (req, res, next) {
  edit.payBill(req, res);
});

router.use(error.inject404());

module.exports = router;
