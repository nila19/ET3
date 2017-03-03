'use strict';

const numeral = require('numeral');
const accounts = require('../models/Accounts')();
const bills = require('../models/Bills')();
const transactions = require('../models/Transactions')();
const error = 1000;

// **************************** transactions ****************************//
const getTransactionById = function (req, resp, transId) {
  transactions.findById(req.app.locals.db, transId).then((doc) => {
    return resp.json({code: 0, data: doc});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};

// **************************** bills ****************************//
const getBills = function (req, resp) {
  let promise = null;

  if(req.body.acctId) {
    promise = bills.findForAcct(req.app.locals.db, numeral(req.query.acctId).value(), req.query.paidInd);
  } else {
    promise = bills.findForCity(req.app.locals.db, numeral(req.query.cityId).value(), req.query.paidInd);
  }
  promise.then((docs) => {
    return resp.json({code: 0, data: docs});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};
const getBillById = function (req, resp, billId) {
  bills.findById(req.app.locals.db, billId).then((doc) => {
    return resp.json({code: 0, data: doc});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};

// **************************** account ****************************//
const getAccountById = function (req, resp, acctId) {
  accounts.findById(req.app.locals.db, acctId).then((doc) => {
    return resp.json({code: 0, data: doc});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};

module.exports = {
  getTransactionById: getTransactionById,
  getBills: getBills,
  getBillById: getBillById,
  getAccountById: getAccountById,
};
