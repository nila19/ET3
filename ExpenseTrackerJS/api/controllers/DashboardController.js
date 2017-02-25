'use strict';

const accounts = require('../models/Accounts')();
const bills = require('../models/Bills')();
const transactions = require('../models/Transactions');
const error = 1000;

// **************************** transactions ****************************//
const getTransactionById = function (req, resp, transId) {
  transactions.findOne(req.app.locals.db, {transId: transId}).then((docs) => {
    return resp.json({code: 0, data: docs});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};

// **************************** bills ****************************//
const getBills = function (req, resp) {
  let promise = null;

  if(req.body.acctId) {
    promise = bills.findForAcct(req.app.locals.db, req.body.acctId, req.body.paidInd);
  } else {
    promise = bills.findForCity(req.app.locals.db, req.body.cityId, req.body.paidInd);
  }
  promise.then((doc) => {
    return resp.json({code: 0, data: doc});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};
const getBillById = function (req, resp, billId) {
  bills.findOne(req.app.locals.db, {billId: billId}).then((doc) => {
    return resp.json({code: 0, data: doc});
  }).catch((err) => {
    req.app.locals.log.error(err);
    return resp.json({code: error});
  });
};

// **************************** account ****************************//
const getAccountById = function (req, resp, acctId) {
  accounts.findOne(req.app.locals.db, {acctId: acctId}).then((docs) => {
    return resp.json({code: 0, data: docs});
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
